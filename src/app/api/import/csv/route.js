/**
 * @fileoverview API endpoint for CSV import
 * 
 * POST /api/import/csv
 * 
 * Accepts a CSV file upload and normalizes it into Prospect objects.
 * Optionally saves to MongoDB if configured.
 * 
 * Request:
 *   - FormData with 'file' field containing CSV file
 *   - Optional 'source' field to specify source type (default: 'openvc')
 *   - Optional 'saveToDb' query param (default: false)
 * 
 * Response:
 *   {
 *     success: true,
 *     count: number,
 *     prospects: Prospect[],
 *     saved?: number  // if saveToDb=true
 *   }
 */

import { NextResponse } from 'next/server';
import { importOpenVcCsv } from '@/lib/csv/importOpenVc';
import { importAngelMatchCsv } from '@/lib/csv/importAngelMatch';
import { enrichGeoBatch } from '@/lib/enrichment/geoEnrichment';
import { filterProspects, getFilterStats, calculateRelevanceScore } from '@/lib/filtering/relevanceFilter';
import { prepareProspectForDB, createProspectIndexes, validateProspect } from '@/lib/models/prospect';
import Papa from 'papaparse';

// Optional MongoDB import - will fail gracefully if not configured
async function getDatabaseConnection() {
  if (!process.env.MONGODB_URI) {
    return null;
  }
  try {
    const mongodb = await import('@/lib/mongodb');
    return mongodb.connectToDatabase;
  } catch (err) {
    console.warn('MongoDB not configured, database saving will be disabled');
    return null;
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const source = formData.get('source') || 'openvc';
    // Default to true if MongoDB is configured (user can opt-out with ?saveToDb=false)
    // If MongoDB is not configured, default to false
    const saveToDbParam = request.nextUrl.searchParams.get('saveToDb');
    console.log('saveToDbParam from query:', saveToDbParam);
    console.log('MONGODB_URI configured:', !!process.env.MONGODB_URI);
    const saveToDb = saveToDbParam === null 
      ? !!process.env.MONGODB_URI  // Auto-enable if MongoDB configured
      : saveToDbParam === 'true';   // Respect explicit true/false
    console.log('Final saveToDb value:', saveToDb);
    const applyFilter = request.nextUrl.searchParams.get('filter') !== 'false'; // Default: true

    if (!file) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No file provided',
          message: 'Please provide a CSV file in the "file" field'
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid file type',
          message: 'Please upload a CSV file'
        },
        { status: 400 }
      );
    }

    // Read file content
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Auto-detect CSV format by checking headers
    const csvContent = buffer.toString('utf8');
    const parsed = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      preview: 1 // Only read first row to check headers
    });
    
    const headers = parsed.meta.fields || [];
    const isOpenVcFormat = headers.includes('Investor name') && headers.includes('Global HQ');
    const isAngelMatchFormat = headers.includes('name') && headers.includes('markets') && headers.includes('emails');
    
    // Import and normalize CSV based on detected format
    let prospects;
    let detectedSource = source; // Use provided source or default
    
    if (isAngelMatchFormat) {
      console.log('Detected AngelMatch CSV format');
      prospects = await importAngelMatchCsv(buffer);
      detectedSource = 'angelmatch';
    } else if (isOpenVcFormat) {
      console.log('Detected OpenVC CSV format');
      prospects = await importOpenVcCsv(buffer);
      detectedSource = 'openvc';
    } else {
      // Unknown format - try custom/generic handler
      console.log('Unknown format detected, attempting custom CSV import');
      try {
        const { importCustomCsv } = await import('@/lib/csv/importCustom');
        prospects = await importCustomCsv(buffer);
        detectedSource = 'manual'; // Mark as manual/custom import
        console.log(`Successfully imported ${prospects.length} prospects using custom format handler`);
      } catch (customError) {
        // If custom import fails, provide helpful error
        console.error('Custom CSV import failed:', customError);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Unsupported CSV format',
            message: customError.message || 'The CSV file does not match any supported format. Please ensure your CSV has at least a "name" column (or "Investor Name", "Full Name", etc.).',
            detectedHeaders: headers.slice(0, 10),
            supportedFormats: ['AngelMatch', 'OpenVC', 'Custom (with name column)']
          },
          { status: 400 }
        );
      }
    }

    if (prospects.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No valid prospects found',
          message: 'The CSV file did not contain any valid prospect data'
        },
        { status: 400 }
      );
    }

    // Enrich with geographic data
    prospects = enrichGeoBatch(prospects);

    // Optional: AI enrichment (if OpenAI is available and enabled)
    if (process.env.OPENAI_API_KEY && process.env.ENABLE_AI_ENRICHMENT !== 'false') {
      try {
        const { enrichProspectData } = await import('@/lib/ai/enrichment');
        console.log('AI enrichment enabled, enriching prospects...');
        
        // Enrich prospects in batches to avoid rate limits
        const batchSize = 5;
        const enrichedProspects = [];
        
        for (let i = 0; i < prospects.length; i += batchSize) {
          const batch = prospects.slice(i, i + batchSize);
          const enrichedBatch = await Promise.all(
            batch.map(prospect => enrichProspectData(prospect).catch(err => {
              console.warn(`Failed to enrich prospect ${prospect.id}:`, err.message);
              return prospect; // Return original if enrichment fails
            }))
          );
          enrichedProspects.push(...enrichedBatch);
        }
        
        prospects = enrichedProspects;
        console.log(`AI enrichment completed for ${prospects.length} prospects`);
      } catch (enrichError) {
        console.warn('AI enrichment failed, continuing without enrichment:', enrichError.message);
        // Continue without enrichment if it fails
      }
    }

    // Apply relevance filtering if requested
    let filteredProspects = prospects;
    let filterStats = null;
    
    if (applyFilter) {
      filteredProspects = filterProspects(prospects);
      filterStats = getFilterStats(prospects, filteredProspects);
      
      // Use filtered prospects for saving/returning
      prospects = filteredProspects;
    }

    let savedCount = 0;

    // Optionally save to MongoDB
    if (saveToDb) {
      console.log('Attempting to save to database...');
      const connectToDatabase = await getDatabaseConnection();
      if (connectToDatabase) {
        try {
          console.log('Database connection function obtained, connecting...');
          const db = await connectToDatabase();
          console.log(`Connected to database: ${db.databaseName}`);
          const collection = db.collection('prospects');

          // Ensure indexes exist (idempotent - safe to call multiple times)
          await createProspectIndexes(collection);
          console.log('Indexes created/verified');

          // Calculate relevance scores for all prospects
          const prospectsWithScores = prospects.map(prospect => ({
            ...prospect,
            relevanceScore: calculateRelevanceScore(prospect)
          }));
          console.log(`Prepared ${prospectsWithScores.length} prospects with relevance scores`);

          // Prepare prospects for database (add timestamps, validate, etc.)
          const prospectsToSave = prospectsWithScores.map(prospect => {
            const prepared = prepareProspectForDB({
              ...prospect,
              importSource: detectedSource
            });
            
            // Validate before saving
            const validation = validateProspect(prepared);
            if (!validation.valid) {
              console.warn(`Validation errors for prospect ${prepared.id}:`, validation.errors);
            }
            
            return prepared;
          });

          console.log(`Attempting to save ${prospectsToSave.length} prospects to database...`);

          // Skip bulkWrite if there are no prospects to save
          if (prospectsToSave.length > 0) {
            // Use upsert to avoid duplicates (based on id)
            // Remove createdAt from $set since we only want it on insert
            const operations = prospectsToSave.map(prospect => {
              const { createdAt, ...prospectWithoutCreatedAt } = prospect;
              return {
                updateOne: {
                  filter: { id: prospect.id },
                  update: { 
                    $set: prospectWithoutCreatedAt,
                    $setOnInsert: { createdAt: prospect.createdAt }
                  },
                  upsert: true
                }
              };
            });

            const result = await collection.bulkWrite(operations);
            savedCount = result.upsertedCount + result.modifiedCount;
            console.log(`Database save result: ${result.upsertedCount} upserted, ${result.modifiedCount} modified, total saved: ${savedCount}`);
          } else {
            console.log('No prospects to save (all were filtered out)');
          }
        } catch (dbError) {
          console.error('Error saving to database:', dbError);
          console.error('Error stack:', dbError.stack);
          // Don't fail the request if DB save fails, just log it
          // Return prospects anyway so user can see what was imported
        }
      } else {
        console.warn('MongoDB connection function not available - skipping database save');
      }
    } else {
      console.log('saveToDb is false, skipping database save');
    }

    const response = {
      success: true,
      count: prospects.length,
      prospects: prospects.slice(0, 100), // Return first 100 for preview
      saved: saveToDb ? savedCount : undefined,
      message: saveToDb 
        ? `Successfully imported ${prospects.length} prospects (${savedCount} saved to database)`
        : `Successfully imported ${prospects.length} prospects`,
      debug: {
        saveToDb,
        savedCount,
        hasMongoUri: !!process.env.MONGODB_URI
      }
    };

    // Add filter stats if filtering was applied
    if (applyFilter && filterStats) {
      response.filterStats = filterStats;
      response.message += ` (${filterStats.removed} filtered out, ${filterStats.percentage}% relevant)`;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error importing CSV:', error);
    
    // Provide more helpful error messages
    let errorMessage = 'An unexpected error occurred while processing the CSV file';
    let errorDetails = null;
    
    if (error.message.includes('Missing required columns') || error.message.includes('must have a "name" column')) {
      errorMessage = error.message;
    } else if (error.message.includes('No valid prospects') || error.message.includes('did not contain any valid')) {
      errorMessage = 'The CSV file did not contain any valid prospect data. Please check that your CSV has the required columns and data.';
    } else if (error.name === 'SyntaxError' || error.message.includes('parse') || error.message.includes('CSV')) {
      errorMessage = 'The CSV file could not be parsed. Please ensure it is a valid CSV file.';
      errorDetails = error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to import CSV',
        message: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  }
}


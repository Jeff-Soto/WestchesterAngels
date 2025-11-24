import { NextResponse } from 'next/server'
import { enrichProspectData, extractInvestmentThesis, analyzePortfolioPatterns } from '@/lib/ai/enrichment'
import { connectToDatabase } from '@/lib/mongodb'
import { transformProspectForDashboard } from '@/lib/utils/transformProspect'

export async function POST(request) {
  try {
    const body = await request.json()
    const { prospectId } = body

    if (!prospectId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'prospectId is required' 
        },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI API key is not configured' 
        },
        { status: 500 }
      )
    }

    // Fetch prospect from MongoDB
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'MongoDB not configured' 
        },
        { status: 500 }
      )
    }

    const db = await connectToDatabase()
    const collection = db.collection('prospects')
    
    const dbProspect = await collection.findOne({ 
      $or: [
        { id: prospectId },
        { id: String(prospectId) },
        { _id: prospectId }
      ]
    })

    if (!dbProspect) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Prospect not found' 
        },
        { status: 404 }
      )
    }

    // Transform to dashboard format
    const prospect = transformProspectForDashboard(dbProspect)

    // Enrich prospect data
    const enriched = await enrichProspectData(prospect)
    
    // Extract investment thesis
    const thesis = await extractInvestmentThesis(prospect)
    
    // Analyze portfolio patterns
    const portfolioAnalysis = await analyzePortfolioPatterns(prospect)

    // Update database with enriched data
    const updateData = {}
    if (enriched.thesis) updateData.thesis = enriched.thesis
    if (enriched.stagePreferences) updateData.stages = enriched.stagePreferences
    if (enriched.sectors) updateData.markets = enriched.sectors
    if (enriched.minCheckUsd) updateData.minCheckUsd = enriched.minCheckUsd
    if (enriched.maxCheckUsd) updateData.maxCheckUsd = enriched.maxCheckUsd
    if (enriched.aiSummary) updateData.aiSummary = enriched.aiSummary
    if (thesis) updateData.investmentThesis = thesis
    if (portfolioAnalysis) updateData.portfolioAnalysis = portfolioAnalysis
    updateData.lastEnrichedAt = new Date()

    if (Object.keys(updateData).length > 1) { // More than just lastEnrichedAt
      await collection.updateOne(
        { _id: dbProspect._id },
        { $set: updateData }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        prospectId: prospect.id,
        enriched: {
          thesis: enriched.thesis || thesis,
          stagePreferences: enriched.stagePreferences,
          sectors: enriched.sectors,
          minCheckUsd: enriched.minCheckUsd,
          maxCheckUsd: enriched.maxCheckUsd,
          aiSummary: enriched.aiSummary,
          investmentThesis: thesis,
          portfolioAnalysis
        }
      }
    })
  } catch (error) {
    console.error('Error enriching prospect:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to enrich prospect',
        message: error.message 
      },
      { status: 500 }
    )
  }
}


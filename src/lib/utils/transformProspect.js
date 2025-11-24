/**
 * @fileoverview Transform MongoDB prospect documents to dashboard format
 * 
 * Converts MongoDB prospect schema to the format expected by the dashboard UI.
 * Handles both seeded mockData format and normalized CSV format.
 */

import { calculateRelevanceScore } from '@/lib/filtering/relevanceFilter';

/**
 * Transforms a MongoDB prospect document to dashboard format
 * Handles both seeded mockData format and normalized CSV format
 * @param {Object} dbProspect - Prospect document from MongoDB
 * @returns {Object} - Prospect in dashboard format
 */
export function transformProspectForDashboard(dbProspect) {
  // Detect format: if it has 'org' and 'location.city', it's already in dashboard format (seeded data)
  const isAlreadyDashboardFormat = dbProspect.org && dbProspect.location?.city;
  
  if (isAlreadyDashboardFormat) {
    // Already in dashboard format (seeded mockData) - ensure all required fields exist
    // Convert stages to stagePreferences if needed
    let stagePreferences = dbProspect.stagePreferences;
    if (!stagePreferences && dbProspect.stages) {
      // Map stages array to stagePreferences format
      stagePreferences = dbProspect.stages.map(stage => {
        // If already in dashboard format (Seed, Series A, etc.), keep as is
        if (['Pre-Seed', 'Seed', 'Series A', 'Series B+'].some(s => stage.includes(s))) {
          return stage;
        }
        // Otherwise map normalized stages to dashboard format
        const stageMap = {
          'idea': 'Pre-Seed',
          'prototype': 'Seed',
          'early_revenue': 'Seed',
          'scaling': 'Series A',
          'growth': 'Series A',
          'pre_ipo': 'Series B+'
        };
        return stageMap[stage] || stage;
      });
    }
    
    // Always recalculate relevanceScore to ensure it's using the latest 0-100 scale
    // (old data might have 0-20 scores stored)
    // Build prospect object for calculateRelevanceScore
    const prospectForScoring = {
      hqState: dbProspect.hqState || dbProspect.location?.state,
      hqCity: dbProspect.hqCity || dbProspect.location?.city,
      hqCountry: dbProspect.hqCountry || dbProspect.location?.country || 'US',
      investsInUS: dbProspect.investsInUS !== undefined ? dbProspect.investsInUS : true,
      isTriStateHQ: dbProspect.isTriStateHQ !== undefined 
        ? dbProspect.isTriStateHQ 
        : ['NY', 'NJ', 'CT'].includes(dbProspect.location?.state),
      stages: dbProspect.stages || stagePreferences || [],
      countries: dbProspect.countries || ['USA'],
      investorType: dbProspect.investorType,
      email: dbProspect.email,
      phone: dbProspect.phone,
      portfolio: dbProspect.portfolio
    };
    
    // Always recalculate to ensure we're using the new 0-100 scale
    const relevanceScore = calculateRelevanceScore(prospectForScoring);
    
    // relevanceScore is now 0-100, use it directly as fitScore
    const fitScore = Math.round(relevanceScore);
    
    // Ensure status exists (required by dashboard)
    const status = dbProspect.status || 'new';
    
    // Ensure checkSize exists
    const checkSize = dbProspect.checkSize || {
      min: dbProspect.minCheckUsd || null,
      max: dbProspect.maxCheckUsd || null
    };
    
    return {
      ...dbProspect,
      // Ensure id field exists (MongoDB uses _id)
      id: dbProspect.id || dbProspect._id?.toString() || String(dbProspect._id),
      // Required dashboard fields
      fitScore,
      status,
      stagePreferences: stagePreferences || [],
      checkSize,
      // Ensure portfolio exists (array of company names)
      portfolio: Array.isArray(dbProspect.portfolio) ? dbProspect.portfolio : [],
      // Map markets to sectors if needed
      sectors: dbProspect.markets || dbProspect.sectors || [],
      // Ensure other optional fields exist
      tags: Array.isArray(dbProspect.tags) ? dbProspect.tags : [],
      notes: dbProspect.notes || '',
      firstName: dbProspect.firstName || (dbProspect.name ? dbProspect.name.split(' ')[0] : ''),
      lastName: dbProspect.lastName || (dbProspect.name ? dbProspect.name.split(' ').slice(1).join(' ') : ''),
      // Ensure enriched fields exist for "Why they match" section
      hqState: dbProspect.hqState || dbProspect.location?.state,
      hqCity: dbProspect.hqCity || dbProspect.location?.city,
      hqCountry: dbProspect.hqCountry || dbProspect.location?.country || 'US',
      investsInUS: dbProspect.investsInUS !== undefined ? dbProspect.investsInUS : true,
      isTriStateHQ: dbProspect.isTriStateHQ !== undefined 
        ? dbProspect.isTriStateHQ 
        : ['NY', 'NJ', 'CT'].includes(dbProspect.location?.state),
      countries: dbProspect.countries || ['USA'],
      stages: dbProspect.stages || [],
      investorType: dbProspect.investorType || 'solo_angel',
      minCheckUsd: dbProspect.minCheckUsd || dbProspect.checkSize?.min,
      maxCheckUsd: dbProspect.maxCheckUsd || dbProspect.checkSize?.max,
      relevanceScore: relevanceScore
    };
  }
  
  // Normalized CSV format - transform to dashboard format
  const city = dbProspect.hqCity || (dbProspect.hqRaw ? dbProspect.hqRaw.split(',')[0]?.trim() : '') || '';
  const state = dbProspect.hqState || '';
  
  // Map stages to stagePreferences format
  const stagePreferences = (dbProspect.stages || []).map(stage => {
    const stageMap = {
      'idea': 'Pre-Seed',
      'prototype': 'Seed',
      'early_revenue': 'Seed',
      'scaling': 'Series A',
      'growth': 'Series A',
      'pre_ipo': 'Series B+'
    };
    return stageMap[stage] || stage;
  });
  
  // Extract sectors - use markets field directly (from AngelMatch CSV)
  // Fall back to sectors field, then try to infer from thesis if not present
  let sectors = dbProspect.markets || dbProspect.sectors || [];
  
  // If no sectors from markets/sectors, try to infer from thesis (for OpenVC data)
  if (sectors.length === 0 && dbProspect.thesis) {
    const thesisLower = dbProspect.thesis.toLowerCase();
    if (thesisLower.includes('fintech') || thesisLower.includes('fin tech')) sectors.push('FinTech');
    if (thesisLower.includes('health') || thesisLower.includes('healthtech')) sectors.push('HealthTech');
    if (thesisLower.includes('saas') || thesisLower.includes('software')) sectors.push('SaaS');
    if (thesisLower.includes('consumer')) sectors.push('Consumer');
    if (thesisLower.includes('enterprise')) sectors.push('Enterprise Software');
    if (thesisLower.includes('marketplace')) sectors.push('Marketplaces');
    if (thesisLower.includes('media')) sectors.push('Media');
    if (thesisLower.includes('prop') || thesisLower.includes('real estate')) sectors.push('PropTech');
  }
  
  // Map check sizes
  const checkSize = {
    min: dbProspect.minCheckUsd || null,
    max: dbProspect.maxCheckUsd || null
  };
  
  // Always recalculate relevanceScore to ensure it's using the latest 0-100 scale
  // (old data might have 0-20 scores stored)
  // Build prospect object for calculateRelevanceScore
  const prospectForScoring = {
    hqState: dbProspect.hqState,
    hqCity: dbProspect.hqCity,
    hqCountry: dbProspect.hqCountry || 'US',
    investsInUS: dbProspect.investsInUS !== undefined ? dbProspect.investsInUS : true,
    isTriStateHQ: dbProspect.isTriStateHQ,
    stages: dbProspect.stages || [],
    countries: dbProspect.countries || [],
    investorType: dbProspect.investorType,
    email: dbProspect.email,
    phone: dbProspect.phone,
    portfolio: dbProspect.portfolio
  };
  
  // Always recalculate to ensure we're using the new 0-100 scale
  const relevanceScore = calculateRelevanceScore(prospectForScoring);
  
  // relevanceScore is now 0-100, use it directly as fitScore
  const fitScore = Math.round(relevanceScore);
  
  return {
    id: dbProspect.id,
    name: dbProspect.name,
    org: dbProspect.firm || dbProspect.name, // Use firm if available, otherwise name
    location: {
      city: city,
      state: state,
      country: dbProspect.hqCountry || 'US'
    },
    sectors: sectors,
    stagePreferences: stagePreferences,
    checkSize: checkSize,
    fitScore: fitScore,
    whySummary: dbProspect.thesis || dbProspect.bio || '',
    email: dbProspect.email || '',
    linkedin: dbProspect.linkedin || '',
    website: dbProspect.website || '',
    phone: dbProspect.phone || '',
    status: dbProspect.status || 'new',
    // Ensure portfolio exists (array of company names)
    portfolio: Array.isArray(dbProspect.portfolio) ? dbProspect.portfolio : [],
    // Ensure other optional fields exist
    tags: Array.isArray(dbProspect.tags) ? dbProspect.tags : [],
    notes: dbProspect.notes || '',
    firstName: dbProspect.firstName || (dbProspect.name ? dbProspect.name.split(' ')[0] : ''),
    lastName: dbProspect.lastName || (dbProspect.name ? dbProspect.name.split(' ').slice(1).join(' ') : ''),
    // Keep enriched fields for "Why they match" section
    hqState: dbProspect.hqState,
    hqCity: dbProspect.hqCity,
    hqCountry: dbProspect.hqCountry,
    investsInUS: dbProspect.investsInUS,
    isTriStateHQ: dbProspect.isTriStateHQ,
    countries: dbProspect.countries || [],
    stages: dbProspect.stages || [],
    investorType: dbProspect.investorType,
    minCheckUsd: dbProspect.minCheckUsd,
    maxCheckUsd: dbProspect.maxCheckUsd,
    relevanceScore: relevanceScore,
    // AI-generated fields
    aiMatchExplanation: dbProspect.aiMatchExplanation || null,
    researchNotes: dbProspect.researchNotes || null,
    portfolioAnalysis: dbProspect.portfolioAnalysis || null,
    investmentThesis: dbProspect.investmentThesis || dbProspect.thesis || null,
    aiSummary: dbProspect.aiSummary || null,
    // Metadata
    createdAt: dbProspect.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: dbProspect.updatedAt?.toISOString() || new Date().toISOString(),
    importedAt: dbProspect.importedAt?.toISOString() || null,
    source: dbProspect.source,
    sourceId: dbProspect.sourceId
  };
}

/**
 * Transforms an array of MongoDB prospect documents
 * @param {Array<Object>} dbProspects - Array of prospect documents from MongoDB
 * @returns {Array<Object>} - Array of prospects in dashboard format
 */
export function transformProspectsForDashboard(dbProspects) {
  return dbProspects.map(transformProspectForDashboard);
}

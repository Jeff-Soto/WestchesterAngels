/**
 * @fileoverview Relevance filtering and scoring for Westchester Angels
 * 
 * Filters prospects based on geography, investor type, and stage
 * to identify investors relevant to Westchester Angels' focus.
 * Calculates relevance scores (0-100) for ranking and prioritization.
 */

/**
 * Geo radius options for filtering
 */
export const GEO_RADIUS_OPTIONS = {
  GLOBAL: 'global',
  US_ONLY: 'us_only',
  TRI_STATE: 'tri_state', // NY, NJ, CT only
  NYC_60_MILES: 'nyc_60_miles' // NY, NJ, CT, PA (default for Westchester Angels)
};

/**
 * Configuration for Westchester Angels relevance filtering
 */
export const FILTER_CONFIG = {
  // Geography: Only investors within 60 miles of NYC (NY, NJ, CT, PA)
  requireGeoRelevance: true,
  geoRadius: GEO_RADIUS_OPTIONS.NYC_60_MILES, // Default for Westchester Angels
  
  // Investor types to include
  allowedInvestorTypes: new Set(['vc', 'solo_angel', 'angel_network']),
  
  // Stages to include (Westchester Angels is early-stage focused)
  allowedStages: new Set(['idea', 'prototype', 'early_revenue']),
  
  // Optional: include scaling stage
  includeScaling: false
};

/**
 * Helper: Check if city is in Westchester County or nearby hyper-local area
 * @param {string|null} city - City name
 * @returns {boolean}
 */
function isHyperLocalCity(city) {
  if (!city) return false;
  const cityLower = city.toLowerCase();
  const hyperLocalCities = [
    'white plains',
    'yonkers',
    'new rochelle',
    'scarsdale',
    'rye',
    'westchester',
    'greenwich', // CT but very close
    'stamford' // CT but very close
  ];
  return hyperLocalCities.some(local => cityLower.includes(local));
}

/**
 * Helper: Get investor type score weight
 * @param {string} investorType - Investor type
 * @returns {number} - Score weight (0-25, can be negative)
 */
function getInvestorTypeScore(investorType) {
  if (!investorType) return 0;
  const type = investorType.toLowerCase();
  
  // Best fits for angel groups
  if (type === 'solo_angel') return 25;
  if (type === 'angel_network') return 20;
  if (type === 'vc') return 15;
  
  // Disallowed types get negative
  const disallowed = new Set(['pe', 'public_fund', 'revenue_based', 'corporate_vc']);
  if (disallowed.has(type)) return -20;
  
  // Other types get minimal score
  return 5;
}

/**
 * Helper: Check if has early stage focus
 * @param {string[]} stages - Array of stages
 * @returns {boolean}
 */
function hasEarlyStageFocus(stages) {
  if (!stages || !Array.isArray(stages) || stages.length === 0) return false;
  
  const earlyTokens = ['idea', 'prototype', 'early_revenue', 'seed', 'pre-seed', 'pre_seed'];
  return stages.some(stage => {
    const s = String(stage).toLowerCase();
    return earlyTokens.some(token => s.includes(token));
  });
}

/**
 * Calculates comprehensive relevance score for a prospect
 * Higher score = more relevant to Westchester Angels
 * @param {import('../../types/prospect').Prospect & {
 *   hqCountry?: string | null,
 *   hqState?: string | null,
 *   hqCity?: string | null,
 *   investsInUS?: boolean,
 *   isHQInUS?: boolean,
 *   isTriStateHQ?: boolean,
 *   countries?: string[],
 *   stages?: string[],
 *   investorType?: string,
 *   email?: string | null,
 *   phone?: string | null,
 *   portfolio?: string[]
 * }} prospect - Enriched prospect
 * @returns {number} - Relevance score (0-100)
 */
export function calculateRelevanceScore(prospect) {
  let score = 0;
  
  // Geography scoring (up to 40 points)
  const nycMetroStates = new Set(['NY', 'NJ', 'CT', 'PA']);
  if (nycMetroStates.has(prospect.hqState)) {
    score += 30; // Base score for being in metro area
    
    // Hyper-local bonus for Westchester County and nearby cities
    if (isHyperLocalCity(prospect.hqCity)) {
      score += 10; // Extra bonus for hyper-local
    }
  } else if (prospect.hqCountry === 'US') {
    score += 10; // US-based but outside metro
  } else if (prospect.hqCountry && prospect.hqCountry !== 'US') {
    score -= 30; // HQ outside US (strong negative)
  }
  
  // Investment focus (up to 10 points)
  if (prospect.investsInUS) {
    score += 10; // Invests in US
  }
  
  // Investor type scoring (up to 25 points, can be negative)
  const investorTypeScore = getInvestorTypeScore(prospect.investorType);
  score += investorTypeScore;
  
  // Stage alignment (up to 20 points)
  if (hasEarlyStageFocus(prospect.stages)) {
    score += 20; // Early stage focus
  }
  
  // Contact information bonus (up to 15 points) - optional, not required
  if (prospect.email || prospect.phone) {
    score += 15; // Has contact info (valuable for outreach)
  }
  
  // Portfolio companies bonus (up to 5 points)
  if (prospect.portfolio && prospect.portfolio.length > 0) {
    score += 5; // Has portfolio companies listed (shows track record)
  }
  
  // Global megafund penalty
  if (prospect.countries && prospect.countries.length > 10) {
    score -= 20; // Too global
  }
  
  // Clamp to 0-100 range
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculates geographic relevance score for a prospect (legacy function)
 * @deprecated Use calculateRelevanceScore instead
 */
export function geoScore(prospect) {
  return calculateRelevanceScore(prospect);
}

/**
 * Checks if a prospect is geographically relevant
 * Uses weighted scoring: must score >= 3 to be relevant
 * 
 * Scoring breakdown:
 * - Tri-State HQ: +3 (always passes)
 * - US HQ: +2
 * - Invests in US: +1
 * - Non-US HQ: -2 (strong penalty)
 * - Global megafund (>10 countries): -2 (penalty)
 * 
 * To pass: score >= 3
 * This means:
 * - Tri-State HQ (score 3+) ✅
 * - US HQ + invests in US (score 2+1 = 3) ✅
 * - US HQ only (score 2) ❌ (needs investsInUS)
 * - Non-US HQ + invests in US (score -2+1 = -1) ❌
 * - Global megafund (score reduced by -2) ❌
 * 
 * @param {import('../../types/prospect').Prospect & {
 *   hqCountry?: string | null,
 *   hqState?: string | null,
 *   investsInUS?: boolean,
 *   isHQInUS?: boolean,
 *   isTriStateHQ?: boolean,
 *   countries?: string[]
 * }} prospect - Enriched prospect
 * @returns {boolean} - True if geographically relevant
 */
/**
 * Checks if a prospect is geographically relevant based on radius option
 * @param {import('../../types/prospect').Prospect & {
 *   hqCountry?: string | null,
 *   hqState?: string | null,
 *   investsInUS?: boolean,
 *   isHQInUS?: boolean,
 *   isTriStateHQ?: boolean,
 *   countries?: string[]
 * }} prospect - Enriched prospect
 * @param {string} radiusOption - One of GEO_RADIUS_OPTIONS
 * @returns {boolean} - True if geographically relevant
 */
export function isGeographicallyRelevant(prospect, radiusOption = GEO_RADIUS_OPTIONS.NYC_60_MILES) {
  // Must be US-based (for all radius options except global)
  if (radiusOption !== GEO_RADIUS_OPTIONS.GLOBAL && prospect.hqCountry !== 'US') {
    return false;
  }
  
  // Must invest in US (for all radius options)
  if (!prospect.investsInUS) {
    return false;
  }
  
  // Filter out global megafunds (investing in 10+ countries)
  const totalCountries = prospect.countries ? prospect.countries.length : 0;
  if (totalCountries > 10) {
    return false;
  }
  
  // Apply radius-specific filtering
  switch (radiusOption) {
    case GEO_RADIUS_OPTIONS.GLOBAL:
      // Global: Any US-based investor that invests in US
      return prospect.hqCountry === 'US';
      
    case GEO_RADIUS_OPTIONS.US_ONLY:
      // US Only: Any US-based investor
      return prospect.hqCountry === 'US';
      
    case GEO_RADIUS_OPTIONS.TRI_STATE:
      // Tri-State: NY, NJ, CT only
      const triStateStates = new Set(['NY', 'NJ', 'CT']);
      return prospect.hqState && triStateStates.has(prospect.hqState);
      
    case GEO_RADIUS_OPTIONS.NYC_60_MILES:
    default:
      // NYC 60 miles: NY, NJ, CT, PA (default for Westchester Angels)
      const nycMetroStates = new Set(['NY', 'NJ', 'CT', 'PA']);
      return prospect.hqState && nycMetroStates.has(prospect.hqState);
  }
}

/**
 * Filters a prospect for Westchester Angels relevance
 * @param {import('../../types/prospect').Prospect & {
 *   hqCountry?: string | null,
 *   hqState?: string | null,
 *   investsInUS?: boolean,
 *   isHQInUS?: boolean,
 *   isTriStateHQ?: boolean,
 *   countries?: string[]
 * }} prospect - Enriched prospect
 * @param {Partial<typeof FILTER_CONFIG>} config - Optional filter configuration override
 * @returns {boolean} - True if prospect is relevant
 */
export function filterForWestchester(prospect, config = {}) {
  const cfg = { ...FILTER_CONFIG, ...config };
  
  // 1. Geography relevance
  if (cfg.requireGeoRelevance) {
    const radiusOption = cfg.geoRadius || GEO_RADIUS_OPTIONS.NYC_60_MILES;
    if (!isGeographicallyRelevant(prospect, radiusOption)) {
      return false;
    }
  }
  
  // 2. Investor type relevance
  if (!cfg.allowedInvestorTypes.has(prospect.investorType)) {
    return false;
  }
  
  // 3. Stage alignment
  const allowedStages = new Set(cfg.allowedStages);
  if (cfg.includeScaling) {
    allowedStages.add('scaling');
  }
  
  const matchesStage = prospect.stages.some(s => allowedStages.has(s));
  if (!matchesStage) {
    return false;
  }
  
  return true;
}

/**
 * Filters an array of prospects for Westchester Angels relevance
 * @param {Array<import('../../types/prospect').Prospect>} prospects
 * @param {Partial<typeof FILTER_CONFIG>} config - Optional filter configuration override
 * @returns {Array} - Filtered prospects
 */
export function filterProspects(prospects, config = {}) {
  return prospects.filter(p => filterForWestchester(p, config));
}

/**
 * Gets filtering statistics
 * @param {Array<import('../../types/prospect').Prospect>} allProspects
 * @param {Array<import('../../types/prospect').Prospect>} filteredProspects
 * @returns {Object} - Statistics about the filtering
 */
export function getFilterStats(allProspects, filteredProspects) {
  const total = allProspects.length;
  const filtered = filteredProspects.length;
  const removed = total - filtered;
  const percentage = total > 0 ? ((filtered / total) * 100).toFixed(1) : 0;
  
  // Breakdown by filter reason
  const stats = {
    total,
    filtered,
    removed,
    percentage: parseFloat(percentage),
    breakdown: {
      geoRelevant: 0,
      investorTypeRelevant: 0,
      stageRelevant: 0
    },
    geoBreakdown: {
      triStateHQ: 0,
      usHQ: 0,
      investsInUS: 0,
      nonUSHQ: 0,
      globalMegafund: 0
    }
  };
  
  // Count how many pass each filter criterion
  allProspects.forEach(prospect => {
    // Use new stricter geo relevance check
    if (isGeographicallyRelevant(prospect)) {
      stats.breakdown.geoRelevant++;
    }
    
    // Geo breakdown
    if (prospect.isTriStateHQ) stats.geoBreakdown.triStateHQ++;
    if (prospect.hqCountry === 'US') stats.geoBreakdown.usHQ++;
    if (prospect.investsInUS) stats.geoBreakdown.investsInUS++;
    if (prospect.hqCountry && prospect.hqCountry !== 'US') stats.geoBreakdown.nonUSHQ++;
    if (prospect.countries && prospect.countries.length > 10) stats.geoBreakdown.globalMegafund++;
    
    if (FILTER_CONFIG.allowedInvestorTypes.has(prospect.investorType)) {
      stats.breakdown.investorTypeRelevant++;
    }
    
    const allowedStages = new Set(FILTER_CONFIG.allowedStages);
    if (FILTER_CONFIG.includeScaling) allowedStages.add('scaling');
    if (prospect.stages.some(s => allowedStages.has(s))) {
      stats.breakdown.stageRelevant++;
    }
  });
  
  return stats;
}



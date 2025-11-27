/**
 * @fileoverview Geographic enrichment for prospects
 * 
 * Parses HQ location and investment countries to extract structured geo data
 * and relevance flags for US/Tri-State area.
 */

/**
 * Enriches a prospect with geographic data
 * @param {import('../../types/prospect').Prospect} prospect
 * @returns {import('../../types/prospect').Prospect & {
 *   hqCountry?: string | null,
 *   hqState?: string | null,
 *   hqCity?: string | null,
 *   investsInUS?: boolean,
 *   isHQInUS?: boolean,
 *   isTriStateHQ?: boolean
 * }}
 */
export function enrichGeo(prospect) {
  // If geographic data is already set (e.g., from AngelMatch normalization), use it
  if (prospect.hqCountry && prospect.hqState) {
    return {
      ...prospect,
      // Ensure all flags are set correctly
      investsInUS: prospect.investsInUS !== undefined ? prospect.investsInUS : (prospect.countries.some(c => /usa|united states|us\b/i.test(c))),
      isHQInUS: prospect.isHQInUS !== undefined ? prospect.isHQInUS : (prospect.hqCountry === 'US'),
      isTriStateHQ: prospect.isTriStateHQ !== undefined ? prospect.isTriStateHQ : (prospect.hqCountry === 'US' && ['NY', 'NJ', 'CT'].includes(prospect.hqState))
    };
  }
  
  const hq = prospect.hqRaw || '';
  
  // Check if invests in US
  const investsInUS = prospect.countries.some(c => 
    /usa|united states|us\b/i.test(c)
  );
  
  let hqCountry = null;
  let hqState = null;
  let hqCity = null;
  
  // First, try to detect US state codes (before country detection)
  // This helps avoid false positives like "CA" being detected as Canada
  const usStateMatch = hq.match(/,\s*([A-Z]{2})(?:\s+\d+|$|\s|,)/);
  const validUSStates = new Set([
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC'
  ]);
  
  if (usStateMatch && validUSStates.has(usStateMatch[1])) {
    hqCountry = 'US';
    hqState = usStateMatch[1];
  }
  
  // Detect country from HQ (only if not already detected as US)
  if (!hqCountry) {
    if (/usa|united states|us\b/i.test(hq)) {
      hqCountry = 'US';
    } else if (/\bNL\b|Netherlands/i.test(hq)) {
      hqCountry = 'NL';
    } else if (/\bUAE\b|\bDubai\b/i.test(hq)) {
      hqCountry = 'AE';
    } else if (/\bUK\b|United Kingdom|England|Scotland|Wales/i.test(hq)) {
      hqCountry = 'GB';
    } else if (/\bCanada\b/i.test(hq)) {
      // Only match "Canada" as a word, not "CA" (which could be California)
      hqCountry = 'CA';
    } else if (/\bDE\b|Germany/i.test(hq)) {
      hqCountry = 'DE';
    } else if (/\bFR\b|France/i.test(hq)) {
      hqCountry = 'FR';
    } else if (/\bSG\b|Singapore/i.test(hq)) {
      hqCountry = 'SG';
    } else if (/\bHK\b|Hong Kong/i.test(hq)) {
      hqCountry = 'HK';
    } else if (/\bCN\b|China/i.test(hq)) {
      hqCountry = 'CN';
    } else if (/\bIN\b|India/i.test(hq)) {
      hqCountry = 'IN';
    } else if (/\bAU\b|Australia/i.test(hq)) {
      hqCountry = 'AU';
    } else if (/\bIL\b|Israel/i.test(hq)) {
      hqCountry = 'IL';
    } else if (/\bES\b|Spain/i.test(hq)) {
      hqCountry = 'ES';
    } else if (/\bIT\b|Italy/i.test(hq)) {
      hqCountry = 'IT';
    } else if (/\bBR\b|Brazil/i.test(hq)) {
      hqCountry = 'BR';
    } else if (/\bMX\b|Mexico/i.test(hq)) {
      hqCountry = 'MX';
    }
  }
  
  // If we detected US but didn't get state yet, try to extract it
  if (hqCountry === 'US' && !hqState) {
    // Pattern 1: ", CA" or ", CA 94063" (most common)
    let stateMatch = hq.match(/,\s*([A-Z]{2})(?:\s+\d+|$|\s|,)/);
    
    // Pattern 2: " CA " or " CA," (less common but still valid)
    if (!stateMatch) {
      stateMatch = hq.match(/\s([A-Z]{2})(?:\s|,|$)/);
    }
    
    if (stateMatch && validUSStates.has(stateMatch[1])) {
      hqState = stateMatch[1];
    }
  }
  
  // Try to extract city (rough heuristic - look for common patterns)
  // Format: "City, State" or "City, State ZIP"
  if (hqCountry === 'US') {
    const cityMatch = hq.match(/^([^,]+),/);
    if (cityMatch) {
      hqCity = cityMatch[1].trim();
    }
  }
  
  const isHQInUS = hqCountry === 'US';
  const isTriStateHQ = isHQInUS && ['NY', 'NJ', 'CT'].includes(hqState);
  
  return {
    ...prospect,
    hqCountry,
    hqState,
    hqCity,
    investsInUS,
    isHQInUS,
    isTriStateHQ
  };
}

/**
 * Batch enrich multiple prospects
 * @param {import('../../types/prospect').Prospect[]} prospects
 * @returns {ReturnType<typeof enrichGeo>[]}
 */
export function enrichGeoBatch(prospects) {
  return prospects.map(enrichGeo);
}


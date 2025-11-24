/**
 * @fileoverview Generic CSV normalizer for custom CSV formats
 * 
 * Intelligently maps common column name variations to Prospect schema.
 * Handles flexible CSV formats from clients' own data.
 */

import crypto from 'crypto';

/**
 * Finds a column in headers by matching common name variations
 * @param {string[]} headers - Array of CSV column headers
 * @param {string[]} variations - Array of possible column name variations
 * @returns {string|null} - Found column name or null
 */
function findColumn(headers, variations) {
  const headerMap = new Map(headers.map(h => [h.toLowerCase().trim(), h]));
  
  for (const variation of variations) {
    const lower = variation.toLowerCase().trim();
    // Exact match
    if (headerMap.has(lower)) {
      return headerMap.get(lower);
    }
    // Partial match (contains)
    for (const [headerLower, headerOriginal] of headerMap.entries()) {
      if (headerLower.includes(lower) || lower.includes(headerLower)) {
        return headerOriginal;
      }
    }
  }
  
  return null;
}

/**
 * Normalizes a custom CSV row into a Prospect object
 * @param {object} row - one row from the CSV
 * @param {number} index - row index (0-based)
 * @param {string[]} headers - CSV headers for column detection
 * @returns {import('../../types/prospect').Prospect | null} - Prospect object or null if invalid
 */
export function normalizeCustomRow(row, index, headers) {
  // Find name column (required)
  const nameCol = findColumn(headers, [
    'name', 'investor name', 'full name', 'investor', 'contact name',
    'person', 'individual', 'founder', 'partner'
  ]);
  const name = nameCol ? cleanString(row[nameCol]) : '';
  
  if (!name || name.length === 0) {
    // Return null to indicate invalid row (will be filtered out)
    return null;
  }
  
  // Find other columns with flexible matching
  const websiteCol = findColumn(headers, ['website', 'url', 'company website', 'site']);
  const emailCol = findColumn(headers, ['email', 'e-mail', 'email address', 'contact email']);
  const phoneCol = findColumn(headers, ['phone', 'telephone', 'phone number', 'mobile', 'cell']);
  const linkedinCol = findColumn(headers, ['linkedin', 'linkedin url', 'linkedin profile']);
  const cityCol = findColumn(headers, ['city', 'location', 'hq city']);
  const stateCol = findColumn(headers, ['state', 'province', 'region', 'hq state']);
  const countryCol = findColumn(headers, ['country', 'nation', 'hq country']);
  const stagesCol = findColumn(headers, ['stages', 'investment stages', 'stage', 'stage preferences']);
  const sectorsCol = findColumn(headers, ['sectors', 'markets', 'industries', 'focus areas', 'sector']);
  const investorTypeCol = findColumn(headers, ['investor type', 'type', 'category', 'investor category']);
  const portfolioCol = findColumn(headers, ['portfolio', 'investments', 'companies', 'past investments']);
  
  // Extract values
  const website = websiteCol ? cleanString(row[websiteCol]) || null : null;
  const email = emailCol ? cleanString(row[emailCol]) || null : null;
  const phone = phoneCol ? cleanString(row[phoneCol]) || null : null;
  const linkedin = linkedinCol ? cleanString(row[linkedinCol]) || null : null;
  const city = cityCol ? cleanString(row[cityCol]) || null : null;
  const state = stateCol ? cleanString(row[stateCol]) || null : null;
  const country = countryCol ? cleanString(row[countryCol]) || null : null;
  
  // Build HQ info
  const hqRaw = [city, state, country].filter(Boolean).join(', ') || null;
  
  // Normalize state to state code
  let hqState = state;
  if (state) {
    const stateNameToCode = {
      'new york': 'NY', 'new jersey': 'NJ', 'connecticut': 'CT', 'pennsylvania': 'PA',
      'california': 'CA', 'massachusetts': 'MA', 'texas': 'TX', 'florida': 'FL', 'illinois': 'IL'
    };
    const stateLower = state.toLowerCase().trim();
    if (stateNameToCode[stateLower]) {
      hqState = stateNameToCode[stateLower];
    } else if (state.length === 2 && /^[A-Z]{2}$/.test(state.toUpperCase())) {
      hqState = state.toUpperCase();
    }
  }
  
  // Normalize country
  let hqCountry = country;
  if (country) {
    const countryNameToCode = {
      'united states': 'US', 'usa': 'US', 'us': 'US'
    };
    const countryLower = country.toLowerCase().trim();
    if (countryNameToCode[countryLower]) {
      hqCountry = countryNameToCode[countryLower];
    }
  }
  
  // Parse stages
  const stagesRaw = stagesCol ? cleanString(row[stagesCol]) : '';
  const stages = parseStages(stagesRaw);
  
  // Parse sectors/markets
  const sectorsRaw = sectorsCol ? cleanString(row[sectorsCol]) : '';
  const markets = parseMarkets(sectorsRaw);
  
  // Parse portfolio
  const portfolioRaw = portfolioCol ? cleanString(row[portfolioCol]) : '';
  const portfolio = parsePortfolio(portfolioRaw);
  
  // Normalize investor type
  const investorTypeRaw = investorTypeCol ? cleanString(row[investorTypeCol]) : '';
  const investorType = normalizeInvestorType(investorTypeRaw);
  
  // Set geographic flags
  const isHQInUS = hqCountry === 'US';
  const isTriStateHQ = isHQInUS && ['NY', 'NJ', 'CT'].includes(hqState);
  
  const id = crypto.createHash('md5')
    .update(`custom:${name}:${website || ''}`)
    .digest('hex');
  
  return {
    id,
    name,
    firm: null,
    website,
    hqRaw,
    hqCountry: hqCountry || null,
    hqState: hqState || null,
    hqCity: city || null,
    countries: [],
    investsInUS: isHQInUS, // Assume US investors invest in US if HQ is in US
    isHQInUS,
    isTriStateHQ,
    stages,
    thesis: null,
    investorType,
    minCheckUsd: null,
    maxCheckUsd: null,
    source: 'manual',
    sourceId: String(index),
    score: 0,
    raw: row,
    markets,
    sectors: markets,
    email,
    phone,
    linkedin,
    twitter: null,
    title: null,
    portfolio
  };
}

/**
 * Cleans and trims a string value
 * @param {any} v - value to clean
 * @returns {string}
 */
function cleanString(v) {
  if (!v) return '';
  return String(v).trim();
}

/**
 * Parses investment stages string into normalized array
 * @param {string} value - comma-separated stages
 * @returns {string[]}
 */
function parseStages(value) {
  if (!value) return [];
  
  const STAGE_MAP = {
    'pre-seed': 'idea',
    'pre seed': 'idea',
    'seed': 'prototype',
    'early': 'early_revenue',
    'early revenue': 'early_revenue',
    'series a': 'scaling',
    'series b': 'growth',
    'series c': 'growth',
    'growth': 'growth',
    'pre-ipo': 'pre_ipo',
    'pre ipo': 'pre_ipo'
  };

  return value.split(',')
    .map(s => s.trim().toLowerCase())
    .map(s => {
      if (STAGE_MAP[s]) return STAGE_MAP[s];
      for (const [key, val] of Object.entries(STAGE_MAP)) {
        if (s.includes(key)) return val;
      }
      return null;
    })
    .filter(Boolean);
}

/**
 * Parses markets/sectors string into array
 * @param {string} value - comma-separated markets
 * @returns {string[]}
 */
function parseMarkets(value) {
  if (!value) return [];
  return value.split(',').map(m => m.trim()).filter(Boolean);
}

/**
 * Parses portfolio companies string into array
 * @param {string} value - comma-separated company names
 * @returns {string[]}
 */
function parsePortfolio(value) {
  if (!value) return [];
  return value.split(',').map(c => c.trim()).filter(Boolean);
}

/**
 * Normalizes investor type to enum value
 * @param {string} raw - raw investor type from CSV
 * @returns {('vc'|'solo_angel'|'angel_network'|'corporate_vc'|'family_office'|'accelerator'|'pe'|'public_fund'|'revenue_based'|'other')}
 */
function normalizeInvestorType(raw) {
  if (!raw) return 'other';
  const v = raw.toLowerCase();
  
  if (v.includes('angel') && v.includes('individual')) return 'solo_angel';
  if (v.includes('angel group') || v.includes('angel network')) return 'angel_network';
  if (v === 'vc' || v.includes('venture capital')) return 'vc';
  if (v.includes('corporate')) return 'corporate_vc';
  if (v.includes('family office')) return 'family_office';
  if (v.includes('accelerator') || v.includes('incubator')) return 'accelerator';
  if (v.includes('private equity')) return 'pe';
  if (v.includes('public fund')) return 'public_fund';
  if (v.includes('revenue-based')) return 'revenue_based';
  
  return 'other';
}


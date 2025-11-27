/**
 * @fileoverview Normalization functions for AngelMatch CSV data
 * 
 * Converts raw AngelMatch CSV rows into the unified Prospect schema.
 */

import crypto from 'crypto';

/**
 * Normalizes a single AngelMatch CSV row into a Prospect object
 * @param {object} row - one row from the AngelMatch CSV
 * @param {number} index - row index (0-based)
 * @returns {import('../../types/prospect').Prospect}
 */
export function normalizeAngelMatchRow(row, index) {
  const name = cleanString(row['name']);
  const website = cleanString(row['website']) || null;
  
  const id = crypto.createHash('md5')
    .update(`angelmatch:${name}:${website || ''}`)
    .digest('hex');

  // Parse markets (comma-separated string) into array
  const markets = parseMarkets(row['markets']);
  
  // Parse emails (comma-separated) and take first one
  const emails = parseEmails(row['emails']);
  const email = emails.length > 0 ? emails[0] : null;
  
  // Parse portfolio companies (comma-separated)
  const portfolio = parsePortfolio(row['pastInvestments']);
  
  // Build HQ raw string from city, state, country
  const city = cleanString(row['city']) || null;
  const state = cleanString(row['state']) || null;
  const country = cleanString(row['country']) || null;
  const hqRaw = [city, state, country].filter(Boolean).join(', ') || null;
  
  // Normalize state to state code if it's a full state name
  let hqState = state;
  if (state) {
    const stateNameToCode = {
      'new york': 'NY',
      'new jersey': 'NJ',
      'connecticut': 'CT',
      'pennsylvania': 'PA',
      'california': 'CA',
      'massachusetts': 'MA',
      'texas': 'TX',
      'florida': 'FL',
      'illinois': 'IL'
    };
    const stateLower = state.toLowerCase().trim();
    if (stateNameToCode[stateLower]) {
      hqState = stateNameToCode[stateLower];
    } else if (state.length === 2 && /^[A-Z]{2}$/.test(state.toUpperCase())) {
      hqState = state.toUpperCase();
    }
  }
  
  // Normalize country to country code
  let hqCountry = country;
  if (country) {
    const countryNameToCode = {
      'united states': 'US',
      'usa': 'US',
      'us': 'US'
    };
    const countryLower = country.toLowerCase().trim();
    if (countryNameToCode[countryLower]) {
      hqCountry = countryNameToCode[countryLower];
    }
  }
  
  // Set geographic flags
  const isHQInUS = hqCountry === 'US';
  const isTriStateHQ = isHQInUS && ['NY', 'NJ', 'CT'].includes(hqState);
  
  return {
    id,
    name,
    firm: null, // Leave as null per user request
    website,
    hqRaw,
    hqCountry: hqCountry || null,
    hqState: hqState || null,
    hqCity: city || null,
    countries: [], // AngelMatch doesn't provide investment countries, set to empty array
    investsInUS: true, // Assume US investors invest in US (since they're in tri-state area)
    isHQInUS,
    isTriStateHQ,
    stages: parseStages(row['stages']),
    thesis: null, // AngelMatch doesn't have thesis
    investorType: normalizeInvestorType(row['types']),
    minCheckUsd: null, // AngelMatch doesn't provide check sizes
    maxCheckUsd: null,
    source: 'angelmatch',
    sourceId: String(index),
    score: 0, // Will be computed later
    raw: row,
    // AngelMatch-specific fields
    markets,
    sectors: markets, // Alias for dashboard compatibility
    email,
    phone: cleanString(row['phone']) || null,
    linkedin: cleanString(row['linkedin']) || null,
    twitter: cleanString(row['twitter']) || null,
    title: cleanString(row['title']) || null,
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
 * Parses markets string into array
 * @param {string} value - comma-separated markets
 * @returns {string[]}
 */
function parseMarkets(value) {
  if (!value) return [];
  return value
    .split(',')
    .map(m => m.trim())
    .filter(Boolean);
}

/**
 * Parses emails string into array
 * @param {string} value - comma-separated emails
 * @returns {string[]}
 */
function parseEmails(value) {
  if (!value) return [];
  return value
    .split(',')
    .map(e => e.trim())
    .filter(Boolean);
}

/**
 * Parses portfolio companies string into array
 * @param {string} value - comma-separated company names
 * @returns {string[]}
 */
function parsePortfolio(value) {
  if (!value) return [];
  return value
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);
}

/**
 * Parses investment stages string into normalized array
 * @param {string} value - comma-separated stages like "Seed, Pre-Seed"
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

  const stages = value
    .split(',')
    .map(part => part.trim().toLowerCase())
    .map(label => {
      // Direct match
      if (STAGE_MAP[label]) return STAGE_MAP[label];
      // Partial match
      for (const [key, normalized] of Object.entries(STAGE_MAP)) {
        if (label.includes(key)) return normalized;
      }
      return null;
    })
    .filter(Boolean);
  
  return Array.from(new Set(stages));
}

/**
 * Normalizes investor type to enum value
 * @param {string} raw - comma-separated investor types from CSV
 * @returns {('vc'|'solo_angel'|'angel_network'|'corporate_vc'|'family_office'|'accelerator'|'pe'|'public_fund'|'revenue_based'|'other')}
 */
function normalizeInvestorType(raw) {
  if (!raw) return 'other';
  
  // AngelMatch CSV has comma-separated types, take the first relevant one
  const types = raw.split(',').map(t => t.trim().toLowerCase());
  
  // Priority order for matching
  if (types.some(t => t.includes('angel') && (t.includes('individual') || t.includes('/')))) return 'solo_angel';
  if (types.some(t => t.includes('angel group') || t.includes('angel network'))) return 'angel_network';
  if (types.some(t => t === 'vc' || t.includes('venture capital'))) return 'vc';
  if (types.some(t => t.includes('corporate'))) return 'corporate_vc';
  if (types.some(t => t.includes('family office'))) return 'family_office';
  if (types.some(t => t.includes('accelerator') || t.includes('incubator'))) return 'accelerator';
  if (types.some(t => t.includes('private equity'))) return 'pe';
  if (types.some(t => t.includes('public fund'))) return 'public_fund';
  if (types.some(t => t.includes('revenue-based'))) return 'revenue_based';
  
  // Default to 'other' if no match
  return 'other';
}


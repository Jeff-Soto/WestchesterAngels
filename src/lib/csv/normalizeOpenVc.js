/**
 * @fileoverview Normalization functions for OpenVC CSV data
 * 
 * Converts raw OpenVC CSV rows into the unified Prospect schema.
 */

import crypto from 'crypto';

/**
 * Normalizes a single OpenVC CSV row into a Prospect object
 * @param {object} row - one row from the OpenVC CSV
 * @param {number} index - row index (0-based)
 * @returns {import('../../types/prospect').Prospect}
 */
export function normalizeOpenVcRow(row, index) {
  const name = cleanString(row['Investor name']);
  const website = cleanString(row['Website']) || null;
  
  const id = crypto.createHash('md5')
    .update(`openvc:${name}:${website || ''}`)
    .digest('hex');

  return {
    id,
    name,
    firm: null, // optional later enhancement
    website,
    hqRaw: cleanString(row['Global HQ']) || null,
    countries: parseCountries(row['Countries of investment']),
    stages: parseStages(row['Stage of investment']),
    thesis: cleanString(row['Investment thesis']) || null,
    investorType: normalizeInvestorType(row['Investor type']),
    minCheckUsd: parseMoney(row['First cheque minimum']),
    maxCheckUsd: parseMoney(row['First cheque maximum']),
    source: 'openvc',
    sourceId: String(index),
    score: 0, // you can compute this later
    raw: row
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
 * Parses countries string into array
 * @param {string} value - comma-separated countries
 * @returns {string[]}
 */
function parseCountries(value) {
  if (!value) return [];
  return value
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);
}

/**
 * Parses investment stages string into normalized array
 * @param {string} value - comma-separated stages with numeric prefixes
 * @returns {string[]}
 */
function parseStages(value) {
  if (!value) return [];
  
  const STAGE_MAP = {
    'idea or patent': 'idea',
    'prototype': 'prototype',
    'early revenue': 'early_revenue',
    'scaling': 'scaling',
    'growth': 'growth',
    'pre-ipo': 'pre_ipo'
  };

  const stages = value
    .split(',')
    .map(part => part.replace(/^\d+\.\s*/, '').trim().toLowerCase())
    .map(label => STAGE_MAP[label] || null)
    .filter(Boolean);
  
  return Array.from(new Set(stages));
}

/**
 * Normalizes investor type to enum value
 * @param {string} raw - raw investor type from CSV
 * @returns {('vc'|'solo_angel'|'angel_network'|'corporate_vc'|'family_office'|'accelerator'|'pe'|'public_fund'|'revenue_based'|'other')}
 */
function normalizeInvestorType(raw) {
  if (!raw) return 'other';
  
  const v = raw.toLowerCase();
  
  if (v === 'vc') return 'vc';
  if (v === 'solo angel') return 'solo_angel';
  if (v === 'angel network') return 'angel_network';
  if (v === 'corporate vc') return 'corporate_vc';
  if (v.includes('incubator') || v.includes('accelerator')) return 'accelerator';
  if (v === 'family office') return 'family_office';
  if (v === 'pe fund') return 'pe';
  if (v === 'public fund') return 'public_fund';
  if (v === 'revenue-based') return 'revenue_based';
  
  return 'other';
}

/**
 * Parses money value (removes $, commas, spaces) into USD number
 * @param {string} value - money string like "$10000" or "$1,000,000"
 * @returns {number|null}
 */
function parseMoney(value) {
  if (!value) return null;
  
  const cleaned = String(value).replace(/[$,\s]/g, '');
  const n = Number.parseInt(cleaned, 10);
  
  return Number.isNaN(n) ? null : n;
}


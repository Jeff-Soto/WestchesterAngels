/**
 * @fileoverview MongoDB model/schema for Prospect collection
 * 
 * This defines the structure, validation, and indexes for the prospects collection.
 */

/**
 * Prospect MongoDB Schema
 * 
 * This schema represents the complete structure of a prospect document in MongoDB.
 * It includes normalized data, enriched fields, and database metadata.
 */
export const ProspectSchema = {
  // Core Identity
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
    description: 'Stable ID generated from source + name + website (MD5 hash)'
  },
  
  name: {
    type: String,
    required: true,
    index: true,
    description: 'Investor or firm name'
  },
  
  firm: {
    type: String,
    default: null,
    description: 'Optional firm/organization if name is a person'
  },
  
  website: {
    type: String,
    default: null,
    index: true,
    description: 'Website URL'
  },
  
  // Geographic Data (enriched)
  hqRaw: {
    type: String,
    default: null,
    description: 'Raw HQ text from CSV (e.g., "San Francisco, CA")'
  },
  
  hqCountry: {
    type: String,
    default: null,
    index: true,
    description: 'HQ country code (e.g., "US", "NL", "AE")'
  },
  
  hqState: {
    type: String,
    default: null,
    index: true,
    description: 'HQ US state code (e.g., "NY", "NJ", "CT", "PA")'
  },
  
  hqCity: {
    type: String,
    default: null,
    description: 'HQ city name'
  },
  
  // Investment Geography
  countries: {
    type: [String],
    default: [],
    index: true,
    description: 'Array of countries where they invest'
  },
  
  investsInUS: {
    type: Boolean,
    default: false,
    index: true,
    description: 'Whether the investor invests in US-based startups'
  },
  
  isHQInUS: {
    type: Boolean,
    default: false,
    index: true,
    description: 'Whether HQ is in the US'
  },
  
  isTriStateHQ: {
    type: Boolean,
    default: false,
    index: true,
    description: 'Whether HQ is in Tri-State area (NY, NJ, CT)'
  },
  
  // Investment Preferences
  stages: {
    type: [String],
    default: [],
    index: true,
    description: 'Normalized investment stages: ["idea", "prototype", "early_revenue", "scaling", "growth", "pre_ipo"]'
  },
  
  investorType: {
    type: String,
    required: true,
    enum: ['vc', 'solo_angel', 'angel_network', 'corporate_vc', 'family_office', 'accelerator', 'pe', 'public_fund', 'revenue_based', 'other'],
    index: true,
    description: 'Type of investor'
  },
  
  thesis: {
    type: String,
    default: null,
    description: 'Investment thesis / description'
  },
  
  // Check Sizes
  minCheckUsd: {
    type: Number,
    default: null,
    index: true,
    description: 'Minimum check size in USD'
  },
  
  maxCheckUsd: {
    type: Number,
    default: null,
    description: 'Maximum check size in USD'
  },
  
  // Source & Provenance
  source: {
    type: String,
    required: true,
    enum: ['openvc', 'angelmatch', 'manual'],
    index: true,
    description: 'Data source identifier'
  },
  
  sourceId: {
    type: String,
    default: null,
    description: 'Source-specific ID (e.g., row index, external ID)'
  },
  
  importSource: {
    type: String,
    default: null,
    description: 'Import source identifier (e.g., "openvc", "event", "referral")'
  },
  
  // Scoring & Relevance
  score: {
    type: Number,
    default: 0,
    index: true,
    description: 'Internal fit score (0-100)'
  },
  
  relevanceScore: {
    type: Number,
    default: null,
    index: true,
    description: 'Relevance score (0-100) calculated from geo, stage, investor type, contact info, etc.'
  },
  
  // Contact Information (for future enrichment)
  email: {
    type: String,
    default: null,
    index: true,
    description: 'Primary verified email'
  },
  
  emailCandidates: {
    type: [{
      value: String,
      source: String,
      confidence: Number
    }],
    default: [],
    description: 'Alternative email candidates with source and confidence'
  },
  
  linkedin: {
    type: String,
    default: null,
    description: 'LinkedIn profile URL'
  },
  
  twitter: {
    type: String,
    default: null,
    description: 'Twitter handle/URL'
  },
  
  title: {
    type: String,
    default: null,
    description: 'Job title'
  },
  
  phone: {
    type: String,
    default: null,
    description: 'Phone number'
  },
  
  // Market sectors (from AngelMatch CSV "markets" field)
  markets: {
    type: [String],
    default: [],
    index: true,
    description: 'Market sectors where they invest'
  },
  
  sectors: {
    type: [String],
    default: [],
    index: true,
    description: 'Alias for markets, used in dashboard'
  },
  
  // Portfolio companies (from AngelMatch CSV "pastInvestments" field)
  portfolio: {
    type: [String],
    default: [],
    description: 'Array of portfolio company names'
  },
  
  // Verification & Quality (for future AI verification)
  verified: {
    type: Boolean,
    default: false,
    index: true,
    description: 'Has been human-reviewed'
  },
  
  verificationConfidence: {
    type: Number,
    default: null,
    description: 'AI confidence score (0-100)'
  },
  
  needsReview: {
    type: Boolean,
    default: false,
    index: true,
    description: 'Flagged for human review'
  },
  
  reviewedBy: {
    type: String,
    default: null,
    description: 'User ID who verified'
  },
  
  reviewedAt: {
    type: Date,
    default: null,
    description: 'When prospect was reviewed'
  },
  
  // Status & Workflow
  status: {
    type: String,
    default: 'new',
    enum: ['new', 'contacted', 'interested', 'not_interested', 'archived'],
    index: true,
    description: 'Current status in workflow'
  },
  
  // Raw Data
  raw: {
    type: Object,
    default: {},
    description: 'Original raw row data for debugging/reference'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
    description: 'When prospect was first created'
  },
  
  updatedAt: {
    type: Date,
    default: Date.now,
    index: true,
    description: 'When prospect was last updated'
  },
  
  importedAt: {
    type: Date,
    default: null,
    index: true,
    description: 'When prospect was imported from CSV'
  },
  
  lastEnrichedAt: {
    type: Date,
    default: null,
    description: 'When prospect was last enriched with AI/data'
  }
};

/**
 * MongoDB Indexes for Prospects Collection
 * 
 * These indexes optimize common query patterns:
 * - Filtering by geography (hqState, hqCountry, isTriStateHQ)
 * - Filtering by investor type and stages
 * - Filtering by check size
 * - Sorting by relevance score
 * - Searching by name
 */
export const ProspectIndexes = [
  // Primary lookup
  { id: 1 },
  
  // Geographic filtering (most common for Westchester Angels)
  { hqState: 1 },
  { hqCountry: 1 },
  { isTriStateHQ: 1 },
  { isHQInUS: 1 },
  { investsInUS: 1 },
  
  // Investment preferences
  { investorType: 1 },
  { stages: 1 },
  { countries: 1 },
  { markets: 1 },
  { sectors: 1 },
  
  // Check size filtering
  { minCheckUsd: 1 },
  
  // Scoring & sorting
  { relevanceScore: -1 },
  { score: -1 },
  
  // Source tracking
  { source: 1 },
  { importSource: 1 },
  
  // Status & workflow
  { status: 1 },
  { verified: 1 },
  { needsReview: 1 },
  
  // Text search
  { name: 'text', website: 'text' },
  
  // Timestamps
  { createdAt: -1 },
  { updatedAt: -1 },
  { importedAt: -1 },
  
  // Compound indexes for common queries
  { hqState: 1, investorType: 1, status: 1 },
  { isTriStateHQ: 1, investorType: 1, relevanceScore: -1 },
  { hqState: 1, stages: 1, minCheckUsd: 1 },
  { source: 1, importedAt: -1 }
];

/**
 * Creates indexes on the prospects collection
 * @param {import('mongodb').Collection} collection - MongoDB collection
 */
export async function createProspectIndexes(collection) {
  const indexPromises = ProspectIndexes.map(indexDef => {
    if (typeof indexDef === 'object' && !Array.isArray(Object.values(indexDef)[0])) {
      // Simple index
      const [field, direction] = Object.entries(indexDef)[0];
      return collection.createIndex(
        { [field]: direction },
        { background: true }
      );
    } else {
      // Compound index
      return collection.createIndex(indexDef, { background: true });
    }
  });
  
  await Promise.all(indexPromises);
  console.log(`Created ${ProspectIndexes.length} indexes on prospects collection`);
}

/**
 * Validates a prospect document against the schema
 * @param {Object} prospect - Prospect document to validate
 * @returns {{ valid: boolean, errors: string[] }} - Validation result
 */
export function validateProspect(prospect) {
  const errors = [];
  
  // Required fields
  if (!prospect.id) errors.push('id is required');
  if (!prospect.name) errors.push('name is required');
  if (!prospect.investorType) errors.push('investorType is required');
  if (!prospect.source) errors.push('source is required');
  
  // Enum validation
  const validInvestorTypes = ['vc', 'solo_angel', 'angel_network', 'corporate_vc', 'family_office', 'accelerator', 'pe', 'public_fund', 'revenue_based', 'other'];
  if (prospect.investorType && !validInvestorTypes.includes(prospect.investorType)) {
    errors.push(`investorType must be one of: ${validInvestorTypes.join(', ')}`);
  }
  
  const validSources = ['openvc', 'angelmatch', 'manual'];
  if (prospect.source && !validSources.includes(prospect.source)) {
    errors.push(`source must be one of: ${validSources.join(', ')}`);
  }
  
  const validStatuses = ['new', 'contacted', 'interested', 'not_interested', 'archived'];
  if (prospect.status && !validStatuses.includes(prospect.status)) {
    errors.push(`status must be one of: ${validStatuses.join(', ')}`);
  }
  
  // Type validation
  if (prospect.countries && !Array.isArray(prospect.countries)) {
    errors.push('countries must be an array');
  }
  
  if (prospect.stages && !Array.isArray(prospect.stages)) {
    errors.push('stages must be an array');
  }
  
  if (prospect.minCheckUsd !== null && prospect.minCheckUsd !== undefined && typeof prospect.minCheckUsd !== 'number') {
    errors.push('minCheckUsd must be a number or null');
  }
  
  if (prospect.maxCheckUsd !== null && prospect.maxCheckUsd !== undefined && typeof prospect.maxCheckUsd !== 'number') {
    errors.push('maxCheckUsd must be a number or null');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Prepares a prospect document for MongoDB insertion
 * Ensures all required fields are present and adds timestamps
 * @param {Object} prospect - Prospect data
 * @returns {Object} - Prepared prospect document
 */
export function prepareProspectForDB(prospect) {
  const now = new Date();
  
  return {
    ...prospect,
    createdAt: prospect.createdAt || now,
    updatedAt: now,
    importedAt: prospect.importedAt || (prospect.source === 'openvc' ? now : null),
    // Ensure arrays are arrays
    countries: Array.isArray(prospect.countries) ? prospect.countries : [],
    stages: Array.isArray(prospect.stages) ? prospect.stages : [],
    markets: Array.isArray(prospect.markets) ? prospect.markets : [],
    sectors: Array.isArray(prospect.sectors) ? (prospect.sectors) : (Array.isArray(prospect.markets) ? prospect.markets : []), // Use markets if sectors not set
    portfolio: Array.isArray(prospect.portfolio) ? prospect.portfolio : [],
    // Ensure booleans are booleans
    investsInUS: Boolean(prospect.investsInUS),
    isHQInUS: Boolean(prospect.isHQInUS),
    isTriStateHQ: Boolean(prospect.isTriStateHQ),
    verified: Boolean(prospect.verified),
    needsReview: Boolean(prospect.needsReview),
    // Default status
    status: prospect.status || 'new'
  };
}


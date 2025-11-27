/**
 * @fileoverview Import function for custom CSV files
 * 
 * Handles flexible CSV formats with intelligent column mapping.
 */

import Papa from 'papaparse';
import { normalizeCustomRow } from './normalizeCustom.js';

/**
 * Imports and normalizes a custom CSV file
 * @param {Buffer|string} fileBuffer - CSV file buffer or string content
 * @returns {Promise<import('../../types/prospect').Prospect[]>}
 */
export async function importCustomCsv(fileBuffer) {
  const csvContent = Buffer.isBuffer(fileBuffer) 
    ? fileBuffer.toString('utf8')
    : fileBuffer;

  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim()
  });

  const headers = parsed.meta.fields || [];
  
  // Validate we have at least a name column
  const hasNameColumn = headers.some(h => {
    const lower = h.toLowerCase();
    return lower.includes('name') || lower.includes('investor');
  });
  
  if (!hasNameColumn) {
    throw new Error(
      `CSV must have a "name" column (or similar like "Investor Name", "Full Name", etc.). ` +
      `Found columns: ${headers.join(', ')}`
    );
  }

  // Filter out invalid rows and normalize
  const prospects = parsed.data
    .map((row, idx) => normalizeCustomRow(row, idx, headers))
    .filter(p => p !== null); // Remove null rows (missing name)

  return prospects;
}

/**
 * Imports custom CSV from a file path (Node.js only)
 * @param {string} filePath - path to CSV file
 * @returns {Promise<import('../../types/prospect').Prospect[]>}
 */
export async function importCustomCsvFromFile(filePath) {
  const fs = await import('fs/promises');
  const fileBuffer = await fs.readFile(filePath);
  return importCustomCsv(fileBuffer);
}


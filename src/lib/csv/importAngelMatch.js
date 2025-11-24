/**
 * @fileoverview Import function for AngelMatch CSV files
 * 
 * Parses CSV file and normalizes rows into Prospect objects.
 */

import Papa from 'papaparse';
import { normalizeAngelMatchRow } from './normalizeAngelMatch.js';

/**
 * Imports and normalizes an AngelMatch CSV file
 * @param {Buffer|string} fileBuffer - CSV file buffer or string content
 * @returns {Promise<import('../../types/prospect').Prospect[]>}
 */
export async function importAngelMatchCsv(fileBuffer) {
  const csvContent = Buffer.isBuffer(fileBuffer) 
    ? fileBuffer.toString('utf8')
    : fileBuffer;

  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => {
      // Normalize header names to match expected format
      return header.trim();
    }
  });

  // Filter out rows that are missing required fields (like name)
  const validRows = parsed.data.filter(row => {
    const name = row['name'];
    return name && String(name).trim().length > 0;
  });

  const prospects = validRows.map((row, idx) =>
    normalizeAngelMatchRow(row, idx)
  );

  return prospects;
}

/**
 * Imports AngelMatch CSV from a file path (Node.js only)
 * @param {string} filePath - path to CSV file
 * @returns {Promise<import('../../types/prospect').Prospect[]>}
 */
export async function importAngelMatchCsvFromFile(filePath) {
  const fs = await import('fs/promises');
  const fileBuffer = await fs.readFile(filePath);
  return importAngelMatchCsv(fileBuffer);
}


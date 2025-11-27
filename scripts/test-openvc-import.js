/**
 * @fileoverview Test script for OpenVC CSV import
 * 
 * Usage: node scripts/test-openvc-import.js [path-to-csv]
 * 
 * Example: node scripts/test-openvc-import.js OpenVC_Oct2025.csv
 */

import { importOpenVcCsvFromFile } from '../src/lib/csv/importOpenVc.js';

const csvPath = process.argv[2] || 'OpenVC_Oct2025.csv';

async function main() {
  try {
    console.log(`📂 Importing OpenVC CSV from: ${csvPath}\n`);
    
    const prospects = await importOpenVcCsvFromFile(csvPath);
    
    console.log(`✅ Successfully imported ${prospects.length} prospects\n`);
    
    // Show sample of first 3 prospects
    console.log('📊 Sample prospects (first 3):\n');
    prospects.slice(0, 3).forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.name}`);
      console.log(`   ID: ${p.id}`);
      console.log(`   Website: ${p.website || 'N/A'}`);
      console.log(`   HQ: ${p.hqRaw || 'N/A'}`);
      console.log(`   Countries: ${p.countries.length} (${p.countries.slice(0, 3).join(', ')}${p.countries.length > 3 ? '...' : ''})`);
      console.log(`   Stages: ${p.stages.join(', ')}`);
      console.log(`   Type: ${p.investorType}`);
      console.log(`   Check size: $${p.minCheckUsd?.toLocaleString() || 'N/A'} - $${p.maxCheckUsd?.toLocaleString() || 'N/A'}`);
      console.log(`   Source: ${p.source} (${p.sourceId})`);
      console.log('');
    });
    
    // Show statistics
    console.log('📈 Statistics:\n');
    const investorTypes = {};
    const stageCounts = {};
    const countriesCount = {};
    
    prospects.forEach(p => {
      investorTypes[p.investorType] = (investorTypes[p.investorType] || 0) + 1;
      p.stages.forEach(s => {
        stageCounts[s] = (stageCounts[s] || 0) + 1;
      });
      p.countries.forEach(c => {
        countriesCount[c] = (countriesCount[c] || 0) + 1;
      });
    });
    
    console.log('Investor Types:');
    Object.entries(investorTypes)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
    
    console.log('\nStages:');
    Object.entries(stageCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([stage, count]) => {
        console.log(`  ${stage}: ${count}`);
      });
    
    console.log(`\nUnique Countries: ${Object.keys(countriesCount).length}`);
    console.log(`Top 5 Countries:`);
    Object.entries(countriesCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([country, count]) => {
        console.log(`  ${country}: ${count}`);
      });
    
    // Check for any issues
    const missingNames = prospects.filter(p => !p.name || p.name.trim().length === 0);
    const missingWebsites = prospects.filter(p => !p.website);
    const missingStages = prospects.filter(p => p.stages.length === 0);
    const missingCountries = prospects.filter(p => p.countries.length === 0);
    
    console.log('\n⚠️  Data Quality:\n');
    console.log(`  Missing names: ${missingNames.length}`);
    console.log(`  Missing websites: ${missingWebsites.length}`);
    console.log(`  Missing stages: ${missingStages.length}`);
    console.log(`  Missing countries: ${missingCountries.length}`);
    
    if (missingNames.length > 0) {
      console.log('\n  ⚠️  Warning: Some prospects are missing names!');
    }
    
  } catch (error) {
    console.error('❌ Error importing CSV:', error);
    process.exit(1);
  }
}

main();


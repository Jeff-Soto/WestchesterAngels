/**
 * @fileoverview Test script for relevance filtering
 * 
 * Usage: node scripts/test-filtering.js [path-to-csv]
 * 
 * Example: node scripts/test-filtering.js OpenVC_Oct2025.csv
 */

import { importOpenVcCsvFromFile } from '../src/lib/csv/importOpenVc.js';
import { enrichGeoBatch } from '../src/lib/enrichment/geoEnrichment.js';
import { filterProspects, getFilterStats } from '../src/lib/filtering/relevanceFilter.js';

const csvPath = process.argv[2] || 'OpenVC_Oct2025.csv';

async function main() {
  try {
    console.log(`📂 Importing and filtering CSV: ${csvPath}\n`);
    
    // 1. Import CSV
    let prospects = await importOpenVcCsvFromFile(csvPath);
    console.log(`✅ Imported ${prospects.length} prospects\n`);
    
    // 2. Enrich with geo data
    console.log('🌍 Enriching with geographic data...\n');
    prospects = enrichGeoBatch(prospects);
    
    // Show sample enriched data
    console.log('📊 Sample enriched prospects (first 3):\n');
    prospects.slice(0, 3).forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.name}`);
      console.log(`   HQ: ${p.hqRaw || 'N/A'}`);
      console.log(`   HQ Country: ${p.hqCountry || 'N/A'}`);
      console.log(`   HQ State: ${p.hqState || 'N/A'}`);
      console.log(`   Invests in US: ${p.investsInUS ? 'Yes' : 'No'}`);
      console.log(`   Tri-State HQ: ${p.isTriStateHQ ? 'Yes' : 'No'}`);
      console.log(`   Investor Type: ${p.investorType}`);
      console.log(`   Stages: ${p.stages.join(', ')}`);
      console.log(`   Min Check: $${p.minCheckUsd?.toLocaleString() || 'N/A'}`);
      console.log('');
    });
    
    // 3. Apply filtering
    console.log('🔍 Applying relevance filter for Westchester Angels...\n');
    const filteredProspects = filterProspects(prospects);
    const stats = getFilterStats(prospects, filteredProspects);
    
    // 4. Show results
    console.log('📈 Filtering Results:\n');
    console.log(`Total prospects: ${stats.total}`);
    console.log(`Relevant prospects: ${stats.filtered} (${stats.percentage}%)`);
    console.log(`Filtered out: ${stats.removed}\n`);
    
    console.log('Breakdown by criterion:');
    console.log(`  Geography relevant: ${stats.breakdown.geoRelevant}`);
    console.log(`  Investor type relevant: ${stats.breakdown.investorTypeRelevant}`);
    console.log(`  Stage relevant: ${stats.breakdown.stageRelevant}`);
    console.log(`  Check size relevant: ${stats.breakdown.checkSizeRelevant}\n`);
    
    // Show sample of filtered prospects
    console.log('✅ Sample relevant prospects (first 5):\n');
    filteredProspects.slice(0, 5).forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.name}`);
      console.log(`   Type: ${p.investorType}`);
      console.log(`   HQ: ${p.hqState ? `${p.hqCity || ''}, ${p.hqState}` : p.hqRaw || 'N/A'}`);
      console.log(`   Invests in US: ${p.investsInUS ? 'Yes' : 'No'}`);
      console.log(`   Tri-State: ${p.isTriStateHQ ? 'Yes' : 'No'}`);
      console.log(`   Stages: ${p.stages.join(', ')}`);
      console.log(`   Check: $${p.minCheckUsd?.toLocaleString() || 'N/A'} - $${p.maxCheckUsd?.toLocaleString() || 'N/A'}`);
      console.log('');
    });
    
    // Show breakdown by investor type
    console.log('📊 Relevant prospects by investor type:\n');
    const typeCounts = {};
    filteredProspects.forEach(p => {
      typeCounts[p.investorType] = (typeCounts[p.investorType] || 0) + 1;
    });
    Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
    
    // Show breakdown by HQ state (for US-based)
    console.log('\n📊 Relevant prospects by HQ state (US only):\n');
    const stateCounts = {};
    filteredProspects
      .filter(p => p.hqState)
      .forEach(p => {
        stateCounts[p.hqState] = (stateCounts[p.hqState] || 0) + 1;
      });
    Object.entries(stateCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([state, count]) => {
        console.log(`  ${state}: ${count}`);
      });
    
    console.log('\n✅ Filtering complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();


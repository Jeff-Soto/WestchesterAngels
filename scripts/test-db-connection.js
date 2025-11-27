/**
 * @fileoverview Test script for MongoDB connection
 * 
 * Usage: node scripts/test-db-connection.js
 * 
 * Tests the MongoDB connection and verifies the database and collection exist.
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

import { connectToDatabase } from '../src/lib/mongodb.js';
import { createProspectIndexes } from '../src/lib/models/prospect.js';

async function main() {
  try {
    console.log('🔌 Testing MongoDB connection...\n');
    
    // Test connection
    const db = await connectToDatabase();
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database name: ${db.databaseName}\n`);
    
    // Test collection access
    const collection = db.collection('prospects');
    const count = await collection.countDocuments();
    console.log(`📁 Collection 'prospects' exists`);
    console.log(`📈 Current document count: ${count}\n`);
    
    // Create indexes
    console.log('🔧 Creating indexes...');
    await createProspectIndexes(collection);
    console.log('✅ Indexes created successfully\n');
    
    // List indexes
    const indexes = await collection.indexes();
    console.log(`📋 Total indexes: ${indexes.length}`);
    console.log('Indexes:');
    indexes.forEach((index, idx) => {
      const keys = Object.keys(index.key || {});
      const name = index.name || 'unnamed';
      console.log(`  ${idx + 1}. ${name}: ${keys.join(', ')}`);
    });
    
    console.log('\n✅ Database connection test complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('MONGODB_URI')) {
      console.error('\n💡 Make sure MONGODB_URI is set in your .env.local file');
    }
    process.exit(1);
  }
}

main();


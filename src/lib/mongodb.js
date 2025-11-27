/**
 * @fileoverview MongoDB connection utility
 */

import { MongoClient } from 'mongodb';

// MongoDB is optional - allow graceful degradation if not configured
if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI not configured - database features will be disabled');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

/**
 * Connects to MongoDB and returns the database instance
 * @returns {Promise<import('mongodb').Db>}
 */
export async function connectToDatabase() {
  if (!uri) {
    throw new Error('MongoDB URI not configured. Please set MONGODB_URI in your environment variables.');
  }
  const client = await clientPromise;
  // Use wa_db as default database name for Westchester Angels
  const db = client.db(process.env.MONGODB_DB_NAME || 'wa_db');
  return db;
}

/**
 * Gets the MongoDB client (for advanced operations)
 * @returns {Promise<import('mongodb').MongoClient>}
 */
export async function getMongoClient() {
  return clientPromise;
}

export default clientPromise;


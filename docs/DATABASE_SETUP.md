# Database Setup Guide

## MongoDB Configuration

The application uses MongoDB Atlas (or any MongoDB instance) to store prospect data.

### Environment Variables

Add to your `.env.local` file:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wa_db?retryWrites=true&w=majority
```

**Note**: The database name (`wa_db`) can be specified in the connection string or will default to `wa_db`.

### Database Structure

- **Database**: `wa_db`
- **Collection**: `prospects`

### Automatic Setup

When you upload a CSV file through the dashboard:

1. **Indexes are created automatically** - The first import will create all necessary indexes
2. **Data is validated** - Each prospect is validated before saving
3. **Upsert logic** - Duplicates are prevented (based on `id` field)
4. **Relevance scores calculated** - Each prospect gets a relevance score before saving

## CSV Import Flow

When you upload a CSV file:

```
CSV Upload → Normalize → Enrich (Geo) → Filter → Calculate Scores → Save to MongoDB
```

### What Gets Saved

Each prospect document includes:

- **Core Identity**: `id`, `name`, `firm`, `website`
- **Geographic Data**: `hqCountry`, `hqState`, `hqCity`, `isTriStateHQ`, `investsInUS`
- **Investment Preferences**: `stages`, `investorType`, `countries`, `minCheckUsd`, `maxCheckUsd`
- **Scoring**: `score`, `relevanceScore`
- **Source**: `source`, `sourceId`, `importSource`
- **Timestamps**: `createdAt`, `updatedAt`, `importedAt`
- **Raw Data**: `raw` (original CSV row)

### Default Behavior

- **Filtering**: ON by default (only saves relevant investors within 60 miles of NYC)
- **Database Save**: ON by default (if MongoDB is configured)
- **Indexes**: Created automatically on first import

## Testing the Connection

### Option 1: Test via API

Upload a CSV file through the dashboard - if MongoDB is configured, it will save automatically.

### Option 2: Test via Script

```bash
node scripts/test-db-connection.js
```

**Note**: This script requires `dotenv` and will try to read `.env.local`. If it fails, the API will still work because Next.js loads environment variables automatically.

## Verifying Data

After importing, you can verify data in MongoDB:

```javascript
// Connect to MongoDB
const db = await connectToDatabase();
const collection = db.collection('prospects');

// Count documents
const count = await collection.countDocuments();
console.log(`Total prospects: ${count}`);

// Find Tri-State investors
const triState = await collection.find({ isTriStateHQ: true }).toArray();
console.log(`Tri-State investors: ${triState.length}`);

// Find by relevance score
const highRelevance = await collection
  .find({ relevanceScore: { $gte: 10 } })
  .sort({ relevanceScore: -1 })
  .toArray();
console.log(`High relevance investors: ${highRelevance.length}`);
```

## Indexes

The following indexes are created automatically:

- **Primary**: `id` (unique)
- **Geographic**: `hqState`, `hqCountry`, `isTriStateHQ`, `isHQInUS`, `investsInUS`
- **Investment**: `investorType`, `stages`, `countries`, `minCheckUsd`
- **Scoring**: `relevanceScore`, `score` (descending)
- **Source**: `source`, `importSource`
- **Status**: `status`, `verified`, `needsReview`
- **Text Search**: `name`, `website`
- **Compound**: Multiple compound indexes for common query patterns

## Troubleshooting

### "MongoDB URI not configured"

- Check that `MONGODB_URI` is set in `.env.local`
- Restart your Next.js dev server after adding the variable
- Verify the connection string format is correct

### "Database save failed"

- Check MongoDB connection string
- Verify network access (MongoDB Atlas IP whitelist)
- Check database user permissions
- Look at server logs for detailed error messages

### "No documents saved"

- Check that `saveToDb` checkbox is checked in the upload modal
- Verify filtering isn't removing all prospects
- Check server logs for validation errors

## Next Steps

Once data is in MongoDB, you can:

1. **Query prospects** via API endpoints
2. **Update status** as you contact investors
3. **Track outreach** history
4. **Generate reports** on your investor pipeline


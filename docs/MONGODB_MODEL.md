# MongoDB Prospect Model

## Overview

The Prospect model defines the structure, validation, and indexes for investor prospects stored in MongoDB.

## Schema Definition

The Prospect schema includes:

### Core Identity
- `id` (String, required, unique) - Stable ID (MD5 hash of source + name + website)
- `name` (String, required) - Investor or firm name
- `firm` (String, optional) - Firm/organization if name is a person
- `website` (String, optional) - Website URL

### Geographic Data (Enriched)
- `hqRaw` (String) - Raw HQ text from CSV
- `hqCountry` (String) - HQ country code (e.g., "US", "NL")
- `hqState` (String) - HQ US state code (e.g., "NY", "NJ", "CT", "PA")
- `hqCity` (String) - HQ city name
- `investsInUS` (Boolean) - Whether invests in US
- `isHQInUS` (Boolean) - Whether HQ is in US
- `isTriStateHQ` (Boolean) - Whether HQ is in Tri-State area

### Investment Preferences
- `countries` (Array[String]) - Countries where they invest
- `stages` (Array[String]) - Investment stages: ["idea", "prototype", "early_revenue", "scaling", "growth", "pre_ipo"]
- `investorType` (String, enum) - Type: vc, solo_angel, angel_network, corporate_vc, family_office, accelerator, pe, public_fund, revenue_based, other
- `thesis` (String) - Investment thesis/description
- `minCheckUsd` (Number) - Minimum check size in USD
- `maxCheckUsd` (Number) - Maximum check size in USD

### Source & Provenance
- `source` (String, enum) - Data source: openvc, angelmatch, manual
- `sourceId` (String) - Source-specific ID
- `importSource` (String) - Import identifier (e.g., "openvc", "event", "referral")
- `raw` (Object) - Original raw row data

### Scoring & Relevance
- `score` (Number) - Internal fit score (0-100)
- `relevanceScore` (Number) - Relevance score (0-20+) from geo, stage, check size

### Contact Information (Future)
- `email` (String) - Primary verified email
- `emailCandidates` (Array) - Alternative emails with source/confidence
- `linkedin` (String) - LinkedIn profile URL
- `phone` (String) - Phone number

### Verification & Quality (Future)
- `verified` (Boolean) - Has been human-reviewed
- `verificationConfidence` (Number) - AI confidence score (0-100)
- `needsReview` (Boolean) - Flagged for human review
- `reviewedBy` (String) - User ID who verified
- `reviewedAt` (Date) - When reviewed

### Status & Workflow
- `status` (String, enum) - new, contacted, interested, not_interested, archived

### Timestamps
- `createdAt` (Date) - When first created
- `updatedAt` (Date) - When last updated
- `importedAt` (Date) - When imported from CSV
- `lastEnrichedAt` (Date) - When last enriched

## Indexes

The model includes comprehensive indexes for:

### Primary Lookup
- `id` (unique)

### Geographic Filtering
- `hqState`
- `hqCountry`
- `isTriStateHQ`
- `isHQInUS`
- `investsInUS`

### Investment Preferences
- `investorType`
- `stages`
- `countries`
- `minCheckUsd`

### Scoring & Sorting
- `relevanceScore` (descending)
- `score` (descending)

### Source Tracking
- `source`
- `importSource`

### Status & Workflow
- `status`
- `verified`
- `needsReview`

### Text Search
- `name` (text index)
- `website` (text index)

### Compound Indexes
- `{ hqState: 1, investorType: 1, status: 1 }`
- `{ isTriStateHQ: 1, investorType: 1, relevanceScore: -1 }`
- `{ hqState: 1, stages: 1, minCheckUsd: 1 }`
- `{ source: 1, importedAt: -1 }`

## Usage

### Creating Indexes

```javascript
import { createProspectIndexes } from '@/lib/models/prospect';
import { connectToDatabase } from '@/lib/mongodb';

const db = await connectToDatabase();
const collection = db.collection('prospects');
await createProspectIndexes(collection);
```

### Validating a Prospect

```javascript
import { validateProspect } from '@/lib/models/prospect';

const validation = validateProspect(prospect);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

### Preparing for Database

```javascript
import { prepareProspectForDB } from '@/lib/models/prospect';

const prepared = prepareProspectForDB(prospect);
// Ensures all required fields, adds timestamps, normalizes arrays/booleans
```

## Example Document

```json
{
  "_id": ObjectId("..."),
  "id": "b9d5fd2e4d63984d0d00e1effa3745ac",
  "name": "[sīc] Ventures",
  "firm": null,
  "website": "https://www.sicstudio.org/ventures/ventures",
  "hqRaw": "San Francisco, CA",
  "hqCountry": "US",
  "hqState": "CA",
  "hqCity": "San Francisco",
  "countries": ["Vietnam", "Uzbekistan", "Egypt", "Kenya"],
  "investsInUS": false,
  "isHQInUS": true,
  "isTriStateHQ": false,
  "stages": ["idea", "prototype", "early_revenue", "growth"],
  "investorType": "vc",
  "thesis": "We invest in emerging markets startups.",
  "minCheckUsd": 10000,
  "maxCheckUsd": 200000,
  "source": "openvc",
  "sourceId": "0",
  "importSource": "openvc",
  "score": 0,
  "relevanceScore": 3,
  "status": "new",
  "verified": false,
  "needsReview": false,
  "createdAt": ISODate("2025-01-15T10:00:00Z"),
  "updatedAt": ISODate("2025-01-15T10:00:00Z"),
  "importedAt": ISODate("2025-01-15T10:00:00Z"),
  "raw": { /* original CSV row */ }
}
```

## Query Examples

### Find Tri-State Investors

```javascript
const triStateInvestors = await collection.find({
  isTriStateHQ: true,
  status: 'new'
}).sort({ relevanceScore: -1 }).toArray();
```

### Find by Investor Type and Stage

```javascript
const earlyStageVCs = await collection.find({
  investorType: 'vc',
  stages: { $in: ['idea', 'prototype', 'early_revenue'] },
  hqState: { $in: ['NY', 'NJ', 'CT', 'PA'] }
}).sort({ relevanceScore: -1 }).toArray();
```

### Find by Check Size Range

```javascript
const smallCheckInvestors = await collection.find({
  minCheckUsd: { $lte: 250000 },
  hqState: { $in: ['NY', 'NJ', 'CT', 'PA'] }
}).sort({ minCheckUsd: 1 }).toArray();
```


# Relevance Filtering System

## Overview

The relevance filtering system automatically filters out investors that are not relevant to Westchester Angels based on geography, investor type, investment stage, and check size.

## How It Works

The filtering pipeline follows this flow:

```
CSV → Normalize → Enrich (Geo) → Filter → Relevant Prospects
```

### 1. Geographic Enrichment

The system enriches each prospect with geographic data:

- **HQ Parsing**: Extracts `hqCountry`, `hqState`, and `hqCity` from the raw HQ string
- **US Detection**: Flags `investsInUS`, `isHQInUS`, and `isTriStateHQ`
- **State Detection**: Intelligently detects US states (e.g., "San Francisco, CA" → `hqState: 'CA'`)

### 2. Relevance Filtering

Prospects are filtered based on these criteria:

#### Geography (STRICTEST - 60 miles of NYC)
- ✅ **HQ in NY, NJ, CT, or PA** - Only investors within 60 miles of NYC
- ✅ **Must invest in US** - Must invest in US
- ❌ **All other states** - CA, TX, MA, FL, etc. are filtered out
- ❌ **Foreign HQ** - Dubai, Amsterdam, Singapore, etc. (rejected)
- ❌ **Global megafunds** - Investing in 10+ countries (too broad)

#### Investor Type
**Allowed:**
- `vc` - Venture Capital
- `solo_angel` - Solo angels
- `angel_network` - Angel networks

**Filtered Out:**
- `accelerator` - Accelerators
- `corporate_vc` - Corporate VC (optional, can be enabled)
- `pe` - PE funds
- `public_fund` - Public funds
- `revenue_based` - Revenue-based lenders
- `other` - Other types

#### Investment Stage
**Allowed:**
- `idea` - Idea or Patent stage
- `prototype` - Prototype stage
- `early_revenue` - Early Revenue stage
- `scaling` - Scaling stage (optional, configurable)

**Filtered Out:**
- `growth` - Growth-only investors
- `pre_ipo` - Pre-IPO investors

#### Check Size
- Maximum `minCheckUsd` ≤ $250,000 (configurable)
- Investors with larger minimum checks are filtered out
- Investors with unknown check sizes are allowed (configurable)

## Configuration

Filter configuration is in `src/lib/filtering/relevanceFilter.js`:

```javascript
export const FILTER_CONFIG = {
  requireGeoRelevance: true,
  allowedInvestorTypes: new Set(['vc', 'solo_angel', 'angel_network']),
  allowedStages: new Set(['idea', 'prototype', 'early_revenue']),
  includeScaling: false,  // Set to true to include scaling stage
  maxMinCheckUsd: 250000,
  allowUnknownCheckSize: true
};
```

## Usage

### In API Endpoint

The filtering is automatically applied when importing CSV via the API:

```javascript
// Filtering is ON by default
POST /api/import/csv?saveToDb=true

// To disable filtering
POST /api/import/csv?filter=false
```

### Programmatically

```javascript
import { enrichGeoBatch } from '@/lib/enrichment/geoEnrichment';
import { filterProspects, getFilterStats } from '@/lib/filtering/relevanceFilter';

// 1. Enrich with geo data
const enriched = enrichGeoBatch(prospects);

// 2. Filter for relevance
const relevant = filterProspects(enriched);

// 3. Get statistics
const stats = getFilterStats(enriched, relevant);
console.log(`${stats.filtered} of ${stats.total} prospects are relevant (${stats.percentage}%)`);
```

## Results

Based on the OpenVC October 2025 CSV (2,545 prospects):

- **Total prospects**: 2,545
- **Relevant prospects**: ~54 (2.1%)
- **Filtered out**: ~2,491 (98%)

### Geographic Breakdown (60 miles of NYC)

- **New York (NY)**: ~40+ investors
- **New Jersey (NJ)**: ~5-10 investors
- **Connecticut (CT)**: ~2-5 investors
- **Pennsylvania (PA)**: ~2-5 investors

All investors outside these 4 states are filtered out, regardless of other criteria.

### Breakdown by Criterion

- **Geography relevant**: ~1,688 (66%)
- **Investor type relevant**: ~2,058 (81%)
- **Stage relevant**: ~2,395 (94%)
- **Check size relevant**: ~1,743 (68%)

Note: A prospect must pass ALL criteria to be considered relevant.

## What Gets Filtered Out

The system filters out:

1. **Foreign-only investors** (e.g., Dubai funds, Amsterdam VCs that don't invest in US)
2. **Wrong investor types** (accelerators, PE funds, public funds)
3. **Wrong stages** (growth-only, pre-IPO investors)
4. **Too large checks** (minimum check > $250k)
5. **Non-US focused** (investors that don't invest in US and aren't US-based)

## Examples

### ✅ Relevant Prospect

```
Name: 1st Course Capital
HQ: Redwood City, CA
HQ Country: US
HQ State: CA
Invests in US: Yes
Type: vc
Stages: prototype, early_revenue
Min Check: $25,000
```

**Why relevant:**
- US-based HQ ✓
- VC type ✓
- Early-stage focus ✓
- Reasonable check size ✓

### ❌ Filtered Out Prospect

```
Name: 01 Ventures
HQ: Amsterdam, Netherlands
HQ Country: NL
Invests in US: No
Type: vc
Stages: prototype, early_revenue
```

**Why filtered:**
- Not US-based HQ ✗
- Doesn't invest in US ✗
- Fails geography requirement

## Customization

To adjust filtering criteria, modify `FILTER_CONFIG` in `src/lib/filtering/relevanceFilter.js`:

```javascript
// Include scaling stage
includeScaling: true

// Allow corporate VC
allowedInvestorTypes: new Set(['vc', 'solo_angel', 'angel_network', 'corporate_vc'])

// Increase max check size
maxMinCheckUsd: 500000
```

## Testing

Run the test script to see filtering in action:

```bash
node scripts/test-filtering.js OpenVC_Oct2025.csv
```

This will show:
- Sample enriched prospects
- Filtering statistics
- Sample relevant prospects
- Breakdown by investor type and HQ state


# Architecture Pivot Summary - Version 1.2

**Date**: October 31, 2025  
**Status**: Major architectural change  
**Impact**: High - affects data ingestion, verification, and UI

---

## 🎯 Why We Pivoted

### Original Approach (v1.0-1.1)

- Single upstream API (Crunchbase → OpenVC)
- Assumed data correctness
- AI for scoring/enrichment only
- Cost: **$329-879/month** (still expensive)

### Problems Identified

1. **OpenVC**: No API + NC/ND licensing = not suitable for commercial use
2. **Crunchbase**: $35,000/year API subscription = too expensive for client
3. **Bottleneck**: Data acquisition cost, not AI capabilities

---

## 💡 New Approach (v1.2)

### Multi-Source + AI Verification + Human-in-the-Loop

**Core Philosophy**: Build an intelligent curation system that:

- Uses FREE public sources
- Validates data quality with AI
- Involves humans for uncertain cases
- Client controls their own data

### Data Sources (All Free/Low-Cost)

1. **Public investor lists**
   - OpenVC "list of lists"
   - NYC angel directories
   - Alumni/network pages
2. **Firm team pages**
   - Lightweight scraping
   - Extract: name, title, bio, LinkedIn
3. **Client CSV uploads**
   - Events, conferences
   - Referrals, warm intros
   - Partner organizations (Jumpstart NJ, etc.)

---

## 🏗️ New Architecture Components

### 1. Multi-Source Collection Layer

**Status**: New functionality

- Automated weekly scraping of public lists
- On-demand firm page scraping
- CSV upload interface with column mapping
- Source tracking and provenance

### 2. AI Verification Layer

**Status**: New functionality

- **"Same person?" validation**: Match records across sources
- **Source authority ranking**: Firm page (100) > Personal site (80) > Directory (60)
- **Confidence scoring**: 0-100 for each field
- **Conflict detection**: Flag when sources disagree

### 3. Human Review ("Data Inbox")

**Status**: New UI component needed

- Shows records needing review (`needs_review: true`)
- Side-by-side candidate comparison
- Quick approve/correct interface
- Tracks who verified what and when

### 4. Enhanced Database Schema

**Status**: Updated

- Verification fields (`verified`, `verification_confidence`, `needs_review`)
- Candidate storage (`email_candidates`, `linkedin_candidates`)
- Source tracking (`sources[]`, `primary_source`)
- Review history (`reviewed_by`, `reviewed_at`)

---

## 💰 Cost Impact

### Before (v1.1)

| Item             | Cost/mo      |
| ---------------- | ------------ |
| Vercel           | $20          |
| MongoDB          | $60          |
| OpenVC           | $199-499     |
| OpenAI           | $30-80       |
| Constant Contact | $20          |
| **Total**        | **$329-879** |

### After (v1.2)

| Item             | Cost/mo              |
| ---------------- | -------------------- |
| Vercel           | $20                  |
| MongoDB          | $60                  |
| ~~OpenVC~~       | **$0** (public data) |
| OpenAI           | $50-150 (more usage) |
| Constant Contact | $20                  |
| **Total**        | **$150-350**         |

**Savings: $179-529/month ($2,148-6,348/year)**

---

## 📋 What Needs to Be Built

### Phase 1: Database & Backend (Week 1-2)

#### Updated Collections

- [x] **prospects**: Add verification fields
- [x] **sources**: Update for multi-source tracking
- [x] **verification_history**: New collection
- [ ] Create MongoDB indexes
- [ ] Migration script for existing data

#### New API Endpoints

- [ ] `POST /api/sources/upload-csv` - CSV file upload with column mapping
- [ ] `POST /api/sources/scrape-firm` - On-demand firm page scraping
- [ ] `GET /api/prospects/needs-review` - Fetch unverified prospects
- [ ] `PUT /api/prospects/:id/verify` - Mark as verified
- [ ] `POST /api/prospects/:id/merge` - Merge duplicate records
- [ ] `GET /api/verification-history/:id` - View verification log

#### New Library Files

- [ ] `src/lib/collectors/` folder
  - [ ] `publicLists.js` - Scrape public investor lists
  - [ ] `firmPages.js` - Extract from team pages
  - [ ] `csvParser.js` - Parse and map uploaded CSVs
- [ ] `src/lib/verification/` folder
  - [ ] `aiVerifier.js` - AI "same person?" checks
  - [ ] `sourceRanker.js` - Authority scoring
  - [ ] `confidenceScorer.js` - Calculate confidence
  - [ ] `deduplicator.js` - Find and merge duplicates
- [ ] Update `src/lib/openai.js` - Add verification prompts

### Phase 2: UI Components (Week 2-3)

#### New Dashboard Sections

- [ ] **Data Inbox** (`/dashboard/inbox`)
  - [ ] List of prospects needing review
  - [ ] Side-by-side candidate comparison
  - [ ] Quick approve/reject/edit interface
  - [ ] Batch operations
- [ ] **Sources** (`/dashboard/sources`)
  - [ ] List all data sources
  - [ ] Upload CSV interface
  - [ ] Trigger manual scrapes
  - [ ] View collection history

#### Updated Existing Components

- [ ] **Prospect Table**
  - [ ] Add "Verified" badge/column
  - [ ] Show confidence score indicator
  - [ ] Filter by verification status
- [ ] **Prospect Detail Modal**
  - [ ] Show all candidate fields
  - [ ] Display source provenance
  - [ ] Link to verification history
  - [ ] Quick-verify button

### Phase 3: Automation & Testing (Week 3-4)

#### Cron Jobs

- [ ] Update `/api/cron/refresh-data`
  - [ ] Run all collectors
  - [ ] Normalize & deduplicate
  - [ ] AI verification
  - [ ] Flag for review if needed
- [ ] New `/api/cron/re-verify`
  - [ ] Re-run verification on old records
  - [ ] Update confidence scores
  - [ ] Flag changed records

#### Testing

- [ ] Test CSV upload with various formats
- [ ] Test AI verification accuracy
- [ ] Test deduplication logic
- [ ] Test human review workflow
- [ ] Load testing with 1000+ prospects

---

## 🚀 Implementation Priority

### Must-Have (MVP)

1. ✅ Updated database schema
2. CSV upload functionality
3. Basic AI verification
4. Data Inbox UI
5. Verified/unverified filtering

### Nice-to-Have (v2)

- Automated public list scraping
- Firm page scraping
- Bulk operations in Data Inbox
- Advanced conflict resolution
- Verification confidence trends

### Future Enhancements

- Machine learning for "same person?" matching
- Automated source discovery
- LinkedIn profile scraping (via official API)
- Collaborative review (multiple admins)

---

## 📊 Success Metrics

### Data Quality

- **Verification rate**: % of prospects human-verified
- **Confidence scores**: Average AI confidence
- **Duplicate rate**: % of records that are duplicates
- **Source coverage**: # of sources per prospect

### Cost Efficiency

- **Monthly spend**: Track actual vs. budgeted
- **Cost per prospect**: Total cost / # prospects
- **AI efficiency**: Verification cost per record

### User Adoption

- **Review velocity**: Prospects verified per day
- **Source uploads**: CSV uploads per month
- **Dashboard usage**: Active users per week

---

## ⚠️ Migration Notes

### Existing Data

Current dashboard has 30 real prospects. Migration plan:

1. Add new fields with defaults:
   - `verified: false`
   - `verification_confidence: 0`
   - `needs_review: true`
   - `sources: [{type: "manual", name: "Initial Seed Data"}]`
2. Prompt admin to review all existing records
3. Once verified, set `verified: true`

### Breaking Changes

- None for frontend (new fields are additive)
- API responses include new fields (backward compatible)
- Filters work with existing prospects

---

## 📚 Documentation Updates

- [x] TECHNICAL_SPEC.md - Updated architecture
- [x] Cost estimates - New pricing model
- [x] Data flow diagrams - Multi-source approach
- [x] Database schema - Verification fields
- [ ] README.md - Update key features
- [ ] API documentation - New endpoints
- [ ] User guide - Data Inbox workflow

---

## 🎯 Value Proposition

### For the Client

✅ **$6,000-13,000/year savings** vs. original approach  
✅ **Higher data quality** through human verification  
✅ **Full control** over data sources  
✅ **No vendor lock-in** to expensive APIs  
✅ **Flexible ingestion** from events, partners, etc.

### For End Users (Westchester Angels Members)

✅ **Verified contacts** reduce bounce rates  
✅ **Multiple sources** increase data completeness  
✅ **Source transparency** builds trust  
✅ **Fresh data** from recent events/conferences

---

## ✅ Approval Checklist

Before proceeding with implementation:

- [x] Client understands cost savings
- [x] Client accepts human-in-the-loop workflow
- [ ] Client provides initial CSV files for testing
- [ ] Client approves new Data Inbox UI mockup
- [ ] Client commits to reviewing prospects weekly

---

**Document Owner**: Development Team  
**Stakeholder**: Westchester Angels  
**Status**: ✅ Architecture Approved - Ready for Implementation

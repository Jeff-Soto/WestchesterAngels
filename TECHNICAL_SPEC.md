# AI Investor Prospecting Engine – Technical Specification

## Project Overview

The AI Investor Prospecting Engine is an intelligent system designed to discover, enrich, and prioritize prospective investors for the client. The platform combines Crunchbase data with AI-powered enrichment and scoring to deliver actionable investor insights through a secure, embeddable dashboard.

### Key Features

- Automated weekly data ingestion from Crunchbase
- AI-powered investor enrichment and scoring
- Real-time filtering by sector, geography, and fit score
- Secure passwordless authentication
- Email outreach capabilities
- WordPress integration via iframe
- Admin controls for manual lead uploads

---

## Technology Stack

### Frontend

- **Framework**: Next.js (App Router)
- **Structure**: `src/` folder architecture
- **Language**: Vanilla JavaScript (no TypeScript)
- **Styling**: TBD (Tailwind CSS recommended)
- **Hosting**: Vercel

### Backend

- **Runtime**: Node.js (via Next.js API routes)
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js (passwordless)
- **Scheduler**: Vercel Cron Jobs

### AI & Data Services

- **AI Engine**: OpenAI API (GPT-4 recommended)
- **Data Source**: Crunchbase API
- **Optional Enrichment**: Apollo.io, Clearbit APIs
- **Email Service**: SendGrid or Constant Contact

### DevOps

- **Hosting**: Vercel
- **Environment Management**: Vercel Environment Variables
- **Version Control**: Git
- **Monitoring**: Vercel Analytics + custom logging

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     WordPress Site (Client)                  │
│                  ┌──────────────────────────┐               │
│                  │  Embedded Dashboard      │               │
│                  │  (iframe)                │               │
│                  └──────────┬───────────────┘               │
└─────────────────────────────┼───────────────────────────────┘
                              │
                              │ HTTPS
                              │
┌─────────────────────────────┼───────────────────────────────┐
│                     Vercel Hosting                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Next.js Application                      │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │   Dashboard │  │  API Routes │  │  Auth Layer │  │  │
│  │  │   (UI)      │  │             │  │  (NextAuth) │  │  │
│  │  └─────────────┘  └──────┬──────┘  └─────────────┘  │  │
│  └────────────────────────────┼──────────────────────────┘  │
│                               │                              │
│  ┌────────────────────────────┼──────────────────────────┐  │
│  │          Vercel Cron Jobs  │                          │  │
│  │  (Weekly Data Refresh) ────┘                          │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────┬────────────────┬───────────────┬────────────┘
               │                │               │
               │                │               │
        ┌──────▼──────┐  ┌─────▼─────┐  ┌─────▼──────┐
        │  MongoDB    │  │  OpenAI   │  │ Crunchbase │
        │   Atlas     │  │    API    │  │    API     │
        └─────────────┘  └───────────┘  └────────────┘
```

---

## Data Flow

### 1. Data Ingestion (Weekly Automated)

```
Vercel Cron → Crunchbase API Query → Raw Investor Data
                (by region & sector)
```

### 2. Data Processing Pipeline

```
Raw Data → Normalize → Enrich (OpenAI) → Score (AI) → Store (MongoDB)
```

### 3. Dashboard Access

```
User Login → Auth Check → Filter/Query → Display Results → Initiate Outreach
```

### Detailed Flow Diagram

```
┌──────────────────┐
│  Cron Trigger    │  (Weekly, Sundays 2 AM UTC)
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│  1. Crunchbase API Query                         │
│     - Query by region (e.g., NY, CA, MA)        │
│     - Filter by investor type                    │
│     - Pull recent funding rounds                 │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│  2. Data Normalization                           │
│     - Standardize fields                         │
│     - Deduplicate entries                        │
│     - Validate email formats                     │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│  3. AI Enrichment (OpenAI)                       │
│     - Infer sector focus                         │
│     - Determine check size range                 │
│     - Extract stage preferences                  │
│     - Analyze portfolio fit                      │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│  4. Scoring Engine                               │
│     - Calculate fit_score (0-100)                │
│     - Generate AI rationale                      │
│     - Extract key features                       │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│  5. MongoDB Storage                              │
│     - Insert/update prospects collection         │
│     - Store enrichment data                      │
│     - Log processing metadata                    │
└──────────────────────────────────────────────────┘
```

---

## Database Schema

### Collection: `prospects`

Primary collection for investor records.

```javascript
{
  _id: ObjectId,
  name: String,              // Investor/Partner name
  org: String,               // Organization/Firm name
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: [Number]    // [longitude, latitude]
  },
  sectors: [String],         // ["FinTech", "HealthTech", "SaaS"]
  stage_preferences: [String], // ["Seed", "Series A"]
  check_size: {
    min: Number,             // USD
    max: Number              // USD
  },
  fit_score: Number,         // 0-100
  why_summary: String,       // AI-generated rationale
  email: String,             // Contact email (optional)
  linkedin_url: String,
  website: String,
  phone: String,
  status: String,            // "new", "contacted", "interested", "passed", "suppressed"
  tags: [String],            // Custom tags for categorization
  created_at: Date,
  updated_at: Date,
  last_enriched_at: Date,
  source_id: ObjectId        // Reference to sources collection
}
```

**Indexes:**

- `org` (text)
- `sectors` (array)
- `fit_score` (descending)
- `location.state`
- `status`
- `email` (unique, sparse)

---

### Collection: `sources`

Tracks data sources and fetch history.

```javascript
{
  _id: ObjectId,
  type: String,              // "crunchbase", "manual_csv", "apollo"
  url: String,               // API endpoint or file path
  query_params: Object,      // Search parameters used
  fetched_at: Date,
  record_count: Number,
  status: String,            // "success", "partial", "failed"
  error_log: String,
  created_by: String         // User ID for manual uploads
}
```

**Indexes:**

- `type`
- `fetched_at` (descending)

---

### Collection: `scores`

Historical scoring data for tracking changes over time.

```javascript
{
  _id: ObjectId,
  prospect_id: ObjectId,
  fit_score: Number,
  features: {
    sector_match: Number,    // 0-100
    stage_match: Number,
    geo_proximity: Number,
    portfolio_relevance: Number,
    recent_activity: Number
  },
  model_version: String,     // Track scoring algorithm version
  computed_at: Date,
  notes: String              // AI-generated explanation
}
```

**Indexes:**

- `prospect_id`
- `computed_at` (descending)

---

### Collection: `outreach`

Tracks all outreach attempts and responses.

```javascript
{
  _id: ObjectId,
  prospect_id: ObjectId,
  channel: String,           // "email", "warm_intro", "linkedin"
  subject: String,
  message: String,
  sent_at: Date,
  sent_by: String,           // User ID
  status: String,            // "queued", "sent", "delivered", "opened", "replied", "bounced"
  response_received: Boolean,
  response_text: String,
  response_date: Date,
  campaign_id: String,       // For bulk outreach tracking
  metadata: Object           // Email service provider data
}
```

**Indexes:**

- `prospect_id`
- `status`
- `sent_at` (descending)
- `campaign_id`

---

### Collection: `suppression`

Email suppression list for compliance.

```javascript
{
  _id: ObjectId,
  email: String,             // Can be specific email
  domain: String,            // Or entire domain
  reason: String,            // "bounced", "unsubscribed", "complained", "manual"
  added_at: Date,
  added_by: String,          // User ID or "system"
  notes: String
}
```

**Indexes:**

- `email` (unique)
- `domain`

---

### Collection: `users`

Admin users (managed by NextAuth).

```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  role: String,              // "admin", "viewer"
  email_verified: Date,
  created_at: Date,
  last_login: Date
}
```

---

### Collection: `logs`

System activity logs.

```javascript
{
  _id: ObjectId,
  level: String,             // "info", "warn", "error"
  category: String,          // "cron", "api", "auth", "enrichment"
  message: String,
  details: Object,
  user_id: String,
  ip_address: String,
  created_at: Date
}
```

**Indexes:**

- `level`
- `category`
- `created_at` (descending, TTL: 90 days)

---

## API Integrations

### Crunchbase API

**Purpose**: Primary data source for investor information.

**Endpoints to Use**:

- `/searches/organizations` - Find investor firms
- `/entities/organizations/{id}` - Get detailed org info
- `/searches/people` - Find individual investors

**Key Fields to Extract**:

- Organization name
- Location
- Investment focus (sectors)
- Portfolio companies
- Recent investments
- Contact information

**Rate Limits**: 200 requests/minute (Enterprise plan)

**Error Handling**:

- Implement exponential backoff
- Cache responses for 7 days
- Log failed requests for manual review

---

### OpenAI API

**Purpose**: Enrich and score investor profiles.

**Model**: GPT-4 (or GPT-4-turbo)

**Use Cases**:

1. **Sector Classification**

```javascript
const prompt = `Based on this investor's portfolio: ${portfolioCompanies}, 
what are their primary sector focuses? Return as JSON array.`;
```

2. **Fit Score Calculation**

```javascript
const prompt = `Rate this investor's fit for a ${clientSector} company 
in ${clientStage} stage, seeking ${checkSize}. Score 0-100 and explain why.`;
```

3. **Summary Generation**

```javascript
const prompt = `Summarize why this investor would be a good fit in 2-3 sentences: 
${investorProfile}`;
```

**Rate Limits**: 10,000 TPM (tokens per minute)

**Cost Optimization**:

- Batch requests where possible
- Use GPT-3.5-turbo for simpler tasks
- Cache enrichment results

---

### SendGrid / Constant Contact

**Purpose**: Email outreach campaigns.

**Integration Points**:

- Send individual emails
- Create contact lists
- Track open/click rates
- Handle unsubscribes

**Required Setup**:

- Domain authentication (SPF/DKIM)
- Unsubscribe link in all emails
- Bounce handling webhook

---

### Optional: Apollo.io / Clearbit

**Purpose**: Email enrichment and verification.

**Use When**: Crunchbase doesn't provide direct contact info.

**Fields to Enrich**:

- Email addresses
- Phone numbers
- Social profiles
- Company size/funding

---

## Security & Compliance

### Environment Variables (Vercel)

Store all sensitive credentials as environment variables:

```bash
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
NEXTAUTH_SECRET=random_secret_here
NEXTAUTH_URL=https://yourdomain.com

# APIs
CRUNCHBASE_API_KEY=...
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG...

# Optional
APOLLO_API_KEY=...
CLEARBIT_API_KEY=...
```

---

### Data Protection

**Encryption at Rest**:

- Enable MongoDB Atlas encryption
- Encrypt PII fields (email, phone) using field-level encryption

**Encryption in Transit**:

- All API calls over HTTPS
- TLS 1.2+ required

**Access Controls**:

- Role-based access in dashboard
- API routes protected by middleware
- MongoDB IP whitelist

---

### Compliance

#### CAN-SPAM Compliance

- Clear sender identification
- Accurate subject lines
- Valid physical address in footer
- One-click unsubscribe
- Honor opt-outs within 10 days

#### GDPR Compliance

- Lawful basis for processing (legitimate interest)
- Data subject rights (access, deletion)
- Privacy policy disclosure
- EU data residency (MongoDB region selection)

#### Data Source Compliance

- ✅ Crunchbase: Licensed B2B data
- ✅ Apollo.io: GDPR/CCPA compliant
- ✅ Clearbit: Business data only
- ❌ LinkedIn scraping: Prohibited

---

### Security Best Practices

1. **Authentication**

   - Passwordless magic links
   - Session expiry (7 days)
   - CSRF protection (built into Next.js)

2. **API Security**

   - Rate limiting on all endpoints
   - Input validation and sanitization
   - No sensitive data in URLs

3. **Iframe Embedding**

   - Content Security Policy headers
   - X-Frame-Options: ALLOW-FROM client-domain.com
   - Secure iframe communication

4. **Logging**
   - No PII in application logs
   - Audit trail for data access
   - Regular security reviews

---

## Project Structure

```
WestchesterAngels/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.js
│   │   │   ├── cron/
│   │   │   │   └── refresh-data/
│   │   │   │       └── route.js
│   │   │   ├── prospects/
│   │   │   │   ├── route.js           # GET all prospects
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.js       # GET/PUT/DELETE single
│   │   │   │   └── upload/
│   │   │   │       └── route.js       # POST CSV upload
│   │   │   ├── enrich/
│   │   │   │   └── route.js           # Trigger enrichment
│   │   │   ├── outreach/
│   │   │   │   └── route.js           # Send emails
│   │   │   └── stats/
│   │   │       └── route.js           # Dashboard stats
│   │   ├── dashboard/
│   │   │   ├── page.js                # Main dashboard
│   │   │   ├── layout.js
│   │   │   └── components/
│   │   │       ├── ProspectTable.js
│   │   │       ├── FilterPanel.js
│   │   │       ├── ScoreChart.js
│   │   │       └── OutreachModal.js
│   │   ├── login/
│   │   │   └── page.js
│   │   ├── layout.js
│   │   └── page.js                    # Landing/redirect
│   ├── lib/
│   │   ├── mongodb.js                 # DB connection
│   │   ├── crunchbase.js              # Crunchbase API client
│   │   ├── openai.js                  # OpenAI helpers
│   │   ├── scoring.js                 # Fit score algorithm
│   │   ├── email.js                   # SendGrid/Constant Contact
│   │   └── utils.js                   # Shared utilities
│   ├── middleware.js                  # Auth protection
│   └── styles/
│       └── globals.css
├── public/
│   ├── logo.svg
│   └── favicon.ico
├── scripts/
│   ├── seed-db.js                     # Initial DB setup
│   └── test-cron.js                   # Local cron testing
├── .env.local                         # Local development only
├── .env.example                       # Template for env vars
├── .gitignore
├── next.config.js
├── package.json
├── vercel.json                        # Cron configuration
├── README.md                          # User-facing docs
└── TECHNICAL_SPEC.md                  # This file
```

---

## Implementation Roadmap

### Phase 1: Infrastructure Setup (Week 1)

#### Day 1-2: Project Initialization

- [x] Create Next.js project with App Router
- [ ] Configure src/ folder structure
- [ ] Set up Git repository
- [ ] Deploy initial Vercel project
- [ ] Configure custom subdomain (e.g., investors.clientdomain.com)

#### Day 3-4: Database & Authentication

- [ ] Provision MongoDB Atlas cluster (M10 or higher)
- [ ] Create database and collections
- [ ] Set up indexes
- [ ] Implement NextAuth.js with magic links
- [ ] Test passwordless login flow

#### Day 5-7: API Integrations

- [ ] Obtain Crunchbase API credentials
- [ ] Obtain OpenAI API key
- [ ] Obtain SendGrid/Constant Contact credentials
- [ ] Create API client libraries in `/src/lib`
- [ ] Test each integration independently
- [ ] Store all keys in Vercel environment variables

---

### Phase 2: Data Pipeline (Week 2)

#### Day 1-2: Crunchbase Integration

- [ ] Build Crunchbase query functions
- [ ] Implement pagination handling
- [ ] Create normalization logic
- [ ] Add deduplication
- [ ] Test with sample queries

#### Day 3-4: AI Enrichment

- [ ] Design OpenAI prompt templates
- [ ] Implement enrichment functions
- [ ] Add error handling and retries
- [ ] Create batch processing logic
- [ ] Test with sample investor profiles

#### Day 5-6: Scoring Engine

- [ ] Define fit score algorithm
- [ ] Implement feature extraction
- [ ] Create AI-powered scoring
- [ ] Generate rationale summaries
- [ ] Store scores in database

#### Day 7: Cron Job Setup

- [ ] Create `/api/cron/refresh-data` endpoint
- [ ] Implement full pipeline orchestration
- [ ] Configure Vercel cron (vercel.json)
- [ ] Add logging and monitoring
- [ ] Test end-to-end pipeline

---

### Phase 3: Dashboard UI (Week 3)

#### Day 1-2: Core Dashboard

- [ ] Create dashboard layout
- [ ] Build prospect table component
- [ ] Implement pagination
- [ ] Add sorting functionality
- [ ] Style with CSS/Tailwind

#### Day 3-4: Filtering & Search

- [ ] Build filter panel (sector, location, score)
- [ ] Implement search functionality
- [ ] Add advanced filters
- [ ] Create filter presets
- [ ] Optimize query performance

#### Day 5-6: Detail Views & Actions

- [ ] Create prospect detail modal
- [ ] Add edit functionality
- [ ] Implement status updates
- [ ] Build outreach modal
- [ ] Add notes/tags capability

#### Day 7: Stats & Visualizations

- [ ] Create stats cards (total prospects, avg score, etc.)
- [ ] Add score distribution chart
- [ ] Build sector breakdown chart
- [ ] Create outreach analytics
- [ ] Implement export to CSV

---

### Phase 4: Testing & Deployment (Week 4)

#### Day 1-2: Testing

- [ ] End-to-end pipeline test
- [ ] Test all CRUD operations
- [ ] Verify authentication flows
- [ ] Test email sending
- [ ] Performance testing
- [ ] Security audit

#### Day 3-4: WordPress Integration

- [ ] Create iframe embed code
- [ ] Configure CSP headers
- [ ] Test cross-origin functionality
- [ ] Style for WordPress theme
- [ ] Add responsive design

#### Day 5: Client Training

- [ ] Create user documentation
- [ ] Record training videos
- [ ] Schedule training session
- [ ] Create admin guide
- [ ] Document troubleshooting

#### Day 6-7: Launch & Monitoring

- [ ] Final production deployment
- [ ] Monitor first cron run
- [ ] Check error logs
- [ ] Verify email deliverability
- [ ] Client handoff

---

## Cron Job Implementation

### Vercel Configuration

**File: `vercel.json`**

```json
{
  "crons": [
    {
      "path": "/api/cron/refresh-data",
      "schedule": "0 2 * * 0"
    }
  ]
}
```

_Runs every Sunday at 2 AM UTC_

---

### Cron Endpoint Logic

**File: `src/app/api/cron/refresh-data/route.js`**

```javascript
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { queryCrunchbase } from "@/lib/crunchbase";
import { enrichWithOpenAI } from "@/lib/openai";
import { computeFitScore } from "@/lib/scoring";

export async function GET(request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectToDatabase();
    const results = {
      fetched: 0,
      enriched: 0,
      scored: 0,
      errors: [],
    };

    // 1. Query Crunchbase for investors
    const regions = ["New York", "California", "Massachusetts"];
    const sectors = ["FinTech", "SaaS", "HealthTech"];

    for (const region of regions) {
      for (const sector of sectors) {
        const investors = await queryCrunchbase({ region, sector });
        results.fetched += investors.length;

        // 2. Process each investor
        for (const investor of investors) {
          try {
            // Normalize data
            const normalized = normalizeInvestor(investor);

            // Check if already exists
            const existing = await db.collection("prospects").findOne({
              org: normalized.org,
            });

            if (
              existing &&
              existing.last_enriched_at > Date.now() - 30 * 24 * 60 * 60 * 1000
            ) {
              // Skip if enriched in last 30 days
              continue;
            }

            // 3. Enrich with OpenAI
            const enriched = await enrichWithOpenAI(normalized);
            results.enriched++;

            // 4. Compute fit score
            const score = await computeFitScore(enriched);
            results.scored++;

            // 5. Save to MongoDB
            await db.collection("prospects").updateOne(
              { org: normalized.org },
              {
                $set: {
                  ...enriched,
                  fit_score: score.score,
                  why_summary: score.rationale,
                  last_enriched_at: new Date(),
                  updated_at: new Date(),
                },
                $setOnInsert: {
                  created_at: new Date(),
                  status: "new",
                },
              },
              { upsert: true }
            );

            // Save score history
            await db.collection("scores").insertOne({
              prospect_id: existing?._id,
              fit_score: score.score,
              features: score.features,
              computed_at: new Date(),
              model_version: "1.0",
            });
          } catch (error) {
            results.errors.push({
              investor: investor.name,
              error: error.message,
            });
          }
        }
      }
    }

    // Log the job completion
    await db.collection("logs").insertOne({
      level: "info",
      category: "cron",
      message: "Data refresh completed",
      details: results,
      created_at: new Date(),
    });

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

function normalizeInvestor(raw) {
  return {
    name: raw.properties?.name || "",
    org: raw.properties?.organization_name || "",
    location: {
      city: raw.properties?.location_city || "",
      state: raw.properties?.location_region || "",
      country: raw.properties?.location_country || "US",
    },
    linkedin_url: raw.properties?.linkedin_url || "",
    website: raw.properties?.website_url || "",
    email: raw.properties?.email || null,
  };
}
```

---

### Manual Trigger (for Testing)

Create a separate endpoint for manual testing:

**File: `src/app/api/admin/trigger-refresh/route.js`**

```javascript
// Requires admin authentication
// Calls same logic as cron but returns detailed logs
```

---

## Scoring Algorithm

### Fit Score Components

The fit score (0-100) is calculated using weighted features:

```javascript
const WEIGHTS = {
  sector_match: 0.3, // 30%
  stage_match: 0.25, // 25%
  geo_proximity: 0.15, // 15%
  check_size_match: 0.15, // 15%
  recent_activity: 0.1, // 10%
  portfolio_relevance: 0.05, // 5%
};
```

### Feature Calculations

**1. Sector Match (0-100)**

```javascript
function calculateSectorMatch(investorSectors, clientSectors) {
  const overlap = investorSectors.filter((s) => clientSectors.includes(s));
  return (overlap.length / clientSectors.length) * 100;
}
```

**2. Stage Match (0-100)**

```javascript
function calculateStageMatch(investorStages, clientStage) {
  return investorStages.includes(clientStage) ? 100 : 0;
}
```

**3. Geographic Proximity (0-100)**

```javascript
function calculateGeoProximity(investorLocation, clientLocation) {
  if (investorLocation.state === clientLocation.state) return 100;
  if (investorLocation.country === clientLocation.country) return 60;
  return 20; // International
}
```

**4. Check Size Match (0-100)**

```javascript
function calculateCheckSizeMatch(investorRange, clientNeed) {
  if (clientNeed >= investorRange.min && clientNeed <= investorRange.max) {
    return 100;
  }
  // Partial match
  const distance = Math.min(
    Math.abs(clientNeed - investorRange.min),
    Math.abs(clientNeed - investorRange.max)
  );
  return Math.max(0, 100 - (distance / clientNeed) * 100);
}
```

**5. Recent Activity (0-100)**

```javascript
function calculateRecentActivity(lastInvestmentDate) {
  const daysSince = (Date.now() - lastInvestmentDate) / (1000 * 60 * 60 * 24);
  if (daysSince < 90) return 100;
  if (daysSince < 180) return 75;
  if (daysSince < 365) return 50;
  return 25;
}
```

---

## Email Outreach

### Template Structure

```javascript
const EMAIL_TEMPLATES = {
  warmIntro: {
    subject: "Introduction: [Company] + [Investor Org]",
    body: `Hi [Investor Name],

[Mutual Contact] suggested I reach out. We're working on [brief pitch].

Given your investment in [portfolio company], I thought you'd be interested.

Would you be open to a brief call next week?

Best,
[Sender]`,
  },

  coldOutreach: {
    subject: "[Company]: [One-line value prop]",
    body: `Hi [Investor Name],

I'm reaching out because [specific reason based on portfolio].

We're [company description] and have [traction metrics].

Are you currently looking at opportunities in [sector]?

Best,
[Sender]

[Unsubscribe link]`,
  },
};
```

### Sending Logic

```javascript
async function sendOutreachEmail(prospectId, templateType, customizations) {
  // 1. Check suppression list
  const suppressed = await checkSuppression(prospect.email);
  if (suppressed) throw new Error("Email suppressed");

  // 2. Get template
  const template = EMAIL_TEMPLATES[templateType];

  // 3. Personalize
  const email = personalizeTemplate(template, prospect, customizations);

  // 4. Send via SendGrid/Constant Contact
  const result = await sendEmail(email);

  // 5. Log outreach
  await db.collection("outreach").insertOne({
    prospect_id: prospectId,
    channel: "email",
    subject: email.subject,
    message: email.body,
    sent_at: new Date(),
    status: "sent",
    metadata: result,
  });

  return result;
}
```

---

## WordPress Integration

### Iframe Embed Code

Provide this to the client to embed in their WordPress page:

```html
<div
  style="width: 100%; height: 800px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;"
>
  <iframe
    src="https://investors.clientdomain.com/dashboard"
    style="width: 100%; height: 100%; border: none;"
    title="Investor Dashboard"
    allow="clipboard-write"
  ></iframe>
</div>
```

### Security Headers

**File: `next.config.js`**

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: "/dashboard",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOW-FROM https://clientdomain.com",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://clientdomain.com",
          },
        ],
      },
    ];
  },
};
```

---

## Monitoring & Maintenance

### Weekly Automated Tasks

- Data refresh from Crunchbase (Sunday 2 AM UTC)
- Re-scoring of existing prospects
- Email bounce processing
- Database backup (MongoDB Atlas automated)

### Monthly Manual Tasks

- Review scoring algorithm performance
- Update sector/stage classifications
- Audit suppression list
- Review outreach analytics
- Client billing verification

### Quarterly Tasks

- OpenAI prompt optimization
- Crunchbase query refinement
- Dashboard UX improvements
- Security audit

---

## Cost Estimates

### Monthly Costs (Approximate)

| Service            | Tier       | Cost              |
| ------------------ | ---------- | ----------------- |
| **Vercel**         | Pro        | $20               |
| **MongoDB Atlas**  | M10        | $60               |
| **Crunchbase API** | Enterprise | $999              |
| **OpenAI API**     | Pay-as-go  | $50-150\*         |
| **SendGrid**       | Essentials | $20               |
| **Total**          |            | **~$1,149-1,249** |

\*Depends on volume; estimate 500 enrichments/week @ $0.01 each

### Client Billing

- Client controls all API accounts and billing
- Westchester Angels receives invoices directly
- Development/support billed separately

---

## Testing Strategy

### Unit Tests

- Scoring algorithm functions
- Data normalization
- Email template rendering

### Integration Tests

- Crunchbase API queries
- OpenAI enrichment
- Database operations
- Email sending

### End-to-End Tests

- Full cron job pipeline
- User login flow
- Dashboard filtering
- Outreach workflow

### Manual Testing Checklist

- [ ] Cron job runs successfully
- [ ] New prospects appear in dashboard
- [ ] Filters work correctly
- [ ] Email sending functional
- [ ] Iframe renders in WordPress
- [ ] Mobile responsive
- [ ] Authentication works
- [ ] CSV export works

---

## Troubleshooting Guide

### Cron Job Not Running

- Check Vercel cron logs in dashboard
- Verify `vercel.json` configuration
- Test manual trigger endpoint
- Check CRON_SECRET environment variable

### Low Fit Scores

- Review scoring algorithm weights
- Check OpenAI prompts
- Verify client profile settings
- Examine feature calculations

### Email Bounces

- Verify domain authentication (SPF/DKIM)
- Check suppression list
- Review email content for spam triggers
- Test with email testing tools

### Slow Dashboard

- Check MongoDB indexes
- Optimize query filters
- Implement pagination
- Add caching layer

### Authentication Issues

- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches domain
- Test magic link email delivery
- Review NextAuth logs

---

## Success Metrics

### KPIs to Track

**Data Quality**

- Number of prospects ingested per week
- Enrichment success rate (%)
- Average fit score distribution

**User Engagement**

- Dashboard login frequency
- Most-used filters
- Prospects viewed per session
- CSV exports per month

**Outreach Performance**

- Emails sent per month
- Open rate (%)
- Reply rate (%)
- Meetings booked

**System Performance**

- Cron job success rate (%)
- API response times
- Error rate
- Uptime (%)

---

## Future Enhancements

### Phase 2 Features (Post-Launch)

- [ ] Slack notifications for high-fit prospects
- [ ] Chrome extension for quick prospect lookup
- [ ] AI-powered email draft suggestions
- [ ] Calendar integration for meeting scheduling
- [ ] CRM integration (HubSpot, Salesforce)

### Advanced Features

- [ ] Machine learning for score optimization
- [ ] Sentiment analysis on investor activity
- [ ] Competitive intelligence tracking
- [ ] Portfolio company network mapping
- [ ] Automated warm intro path finding

---

## Contact & Support

**Development Team**: [Your Company Name]  
**Client**: Westchester Angels  
**Primary Contact**: [Client Name & Email]  
**Support Email**: support@yourdomain.com  
**Documentation**: This file + README.md

---

## Change Log

| Date       | Version | Changes               | Author      |
| ---------- | ------- | --------------------- | ----------- |
| 2025-10-25 | 1.0     | Initial specification | [Your Name] |

---

## Appendix

### Useful Links

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Crunchbase API Documentation](https://data.crunchbase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

### Environment Setup Example

```bash
# .env.local (for development)
MONGODB_URI=mongodb://localhost:27017/investors-dev
NEXTAUTH_SECRET=dev-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000
CRUNCHBASE_API_KEY=your-key-here
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG...
CRON_SECRET=random-secret-for-cron-endpoint
```

---

**Document Status**: ✅ Ready for Development  
**Last Updated**: October 25, 2025  
**Next Review**: Start of Week 2

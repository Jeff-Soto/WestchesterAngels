# Development Checklist

Use this checklist to track your progress during development of the AI Investor Prospecting Engine.

---

## Week 1: Infrastructure Setup

### Day 1-2: Project Initialization

- [ ] Initialize Next.js project with App Router
- [ ] Configure `src/` folder structure
- [ ] Set up Git repository
- [ ] Create initial commit
- [ ] Deploy to Vercel
- [ ] Configure custom subdomain
- [ ] Test deployment pipeline

### Day 3-4: Database & Authentication

- [ ] Create MongoDB Atlas account
- [ ] Provision M10 cluster
- [ ] Create database user
- [ ] Configure network access (whitelist 0.0.0.0/0)
- [ ] Test MongoDB connection locally
- [ ] Create database collections (prospects, sources, scores, outreach, suppression, users, logs)
- [ ] Set up database indexes
- [ ] Install NextAuth.js
- [ ] Configure email provider for magic links
- [ ] Implement authentication pages (login)
- [ ] Test passwordless login flow
- [ ] Add authentication middleware

### Day 5-7: API Integrations

- [ ] Obtain Crunchbase Enterprise API key
- [ ] Obtain OpenAI API key
- [ ] Obtain SendGrid/Constant Contact API key
- [ ] Create `/src/lib/mongodb.js` - database connection utility
- [ ] Create `/src/lib/crunchbase.js` - Crunchbase API client
- [ ] Create `/src/lib/openai.js` - OpenAI API helpers
- [ ] Create `/src/lib/email.js` - email service integration
- [ ] Test each API integration independently
- [ ] Add error handling and retries
- [ ] Store all API keys in Vercel environment variables
- [ ] Verify environment variables are loaded correctly

---

## Week 2: Data Pipeline

### Day 1-2: Crunchbase Integration

- [ ] Research Crunchbase API endpoints
- [ ] Build query functions for organizations
- [ ] Build query functions for people
- [ ] Implement pagination handling
- [ ] Add rate limit handling (200 req/min)
- [ ] Create data normalization function
- [ ] Implement deduplication logic
- [ ] Add data validation
- [ ] Test with sample queries (NY, CA, MA regions)
- [ ] Test with different sector filters
- [ ] Log successful queries to `sources` collection

### Day 3-4: AI Enrichment

- [ ] Design OpenAI prompt templates for sector classification
- [ ] Design OpenAI prompt templates for stage preference extraction
- [ ] Design OpenAI prompt templates for check size estimation
- [ ] Implement `enrichWithOpenAI()` function
- [ ] Add error handling for API failures
- [ ] Implement exponential backoff for rate limits
- [ ] Create batch processing logic
- [ ] Test with sample investor profiles
- [ ] Validate enrichment output format
- [ ] Store enrichment results in database
- [ ] Log enrichment metrics

### Day 5-6: Scoring Engine

- [ ] Define scoring algorithm weights (sector, stage, geo, etc.)
- [ ] Create `/src/lib/scoring.js` module
- [ ] Implement `calculateSectorMatch()` function
- [ ] Implement `calculateStageMatch()` function
- [ ] Implement `calculateGeoProximity()` function
- [ ] Implement `calculateCheckSizeMatch()` function
- [ ] Implement `calculateRecentActivity()` function
- [ ] Implement `computeFitScore()` master function
- [ ] Generate AI-powered rationale for each score
- [ ] Test scoring with various investor profiles
- [ ] Store scores in `scores` collection
- [ ] Add score versioning

### Day 7: Cron Job Setup

- [ ] Create `/src/app/api/cron/refresh-data/route.js`
- [ ] Implement full pipeline orchestration
- [ ] Add CRON_SECRET authentication check
- [ ] Implement error handling and recovery
- [ ] Add comprehensive logging
- [ ] Configure `vercel.json` cron schedule (Sundays 2 AM UTC)
- [ ] Test cron job locally with `npm run test:cron`
- [ ] Deploy and test in Vercel
- [ ] Monitor first production run
- [ ] Verify data appears in MongoDB
- [ ] Check logs collection for errors

---

## Week 3: Dashboard UI

### Day 1-2: Core Dashboard

- [ ] Create `/src/app/dashboard/page.js`
- [ ] Create `/src/app/dashboard/layout.js`
- [ ] Build ProspectTable component
- [ ] Implement table rows with key prospect data
- [ ] Add column sorting (name, org, score, location)
- [ ] Implement pagination (50 prospects per page)
- [ ] Add loading states
- [ ] Add empty state for no results
- [ ] Style with CSS/Tailwind CSS
- [ ] Make responsive for mobile/tablet
- [ ] Test with real data from MongoDB

### Day 3-4: Filtering & Search

- [ ] Create FilterPanel component
- [ ] Add sector filter (multi-select)
- [ ] Add location filter (state/city)
- [ ] Add score range filter (slider)
- [ ] Add status filter (new, contacted, interested, etc.)
- [ ] Implement search by name/org
- [ ] Add "Clear filters" button
- [ ] Create filter presets (e.g., "High score + NY")
- [ ] Optimize queries with MongoDB indexes
- [ ] Add URL query params for shareable filters
- [ ] Test various filter combinations

### Day 5-6: Detail Views & Actions

- [ ] Create ProspectDetail modal component
- [ ] Display full enrichment data
- [ ] Show score breakdown by feature
- [ ] Show AI rationale
- [ ] Add edit functionality
- [ ] Implement status update dropdown
- [ ] Create OutreachModal component
- [ ] Add email template selector
- [ ] Add personalization fields
- [ ] Implement notes/tags system
- [ ] Add activity timeline
- [ ] Test all CRUD operations

### Day 7: Stats & Visualizations

- [ ] Create stats cards (total prospects, avg score, contacted, etc.)
- [ ] Add score distribution chart (histogram)
- [ ] Build sector breakdown pie chart
- [ ] Create outreach performance chart
- [ ] Add recent activity feed
- [ ] Implement "Export to CSV" functionality
- [ ] Test CSV export with large datasets
- [ ] Add data refresh button
- [ ] Show last refresh timestamp

---

## Week 4: Testing & Deployment

### Day 1-2: Testing

- [ ] End-to-end pipeline test (Crunchbase → MongoDB → Dashboard)
- [ ] Test prospect creation (POST /api/prospects)
- [ ] Test prospect retrieval (GET /api/prospects)
- [ ] Test prospect update (PUT /api/prospects/:id)
- [ ] Test prospect deletion (DELETE /api/prospects/:id)
- [ ] Test CSV upload functionality
- [ ] Verify authentication on all protected routes
- [ ] Test magic link email delivery
- [ ] Test email sending functionality
- [ ] Verify suppression list is respected
- [ ] Performance test with 1000+ prospects
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Security audit (check for exposed API keys)
- [ ] Review all error handling paths

### Day 3-4: WordPress Integration

- [ ] Create iframe embed code snippet
- [ ] Configure Content Security Policy headers
- [ ] Configure X-Frame-Options header
- [ ] Test iframe rendering in WordPress
- [ ] Style dashboard for iframe display
- [ ] Test cross-origin communication
- [ ] Make fully responsive for WordPress theme
- [ ] Add fallback for iframe unsupported browsers
- [ ] Test authentication within iframe
- [ ] Document embedding process

### Day 5: Client Training

- [ ] Create user documentation (PDF)
- [ ] Write admin guide for dashboard
- [ ] Document how to upload CSV manually
- [ ] Document how to send outreach emails
- [ ] Document how to interpret fit scores
- [ ] Create video tutorial (screen recording)
- [ ] Schedule training session with client
- [ ] Prepare demo data for training
- [ ] Create troubleshooting FAQ
- [ ] Set up support email/ticket system

### Day 6-7: Launch & Monitoring

- [ ] Final code review
- [ ] Merge all feature branches
- [ ] Deploy to production
- [ ] Verify all environment variables in Vercel
- [ ] Test production deployment end-to-end
- [ ] Monitor first cron job run in production
- [ ] Check Vercel function logs for errors
- [ ] Verify MongoDB write operations
- [ ] Test email deliverability (check spam folders)
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Create client admin account
- [ ] Send login credentials to client securely
- [ ] Client sign-off and handoff

---

## Additional Tasks (Ongoing)

### Documentation

- [ ] Complete README.md
- [ ] Complete TECHNICAL_SPEC.md
- [ ] Update ENV_SETUP.md with any changes
- [ ] Add code comments for complex functions
- [ ] Document API endpoints (consider Swagger/OpenAPI)
- [ ] Create architecture diagrams
- [ ] Document deployment process

### Security

- [ ] Review OWASP Top 10 vulnerabilities
- [ ] Implement rate limiting on API routes
- [ ] Add CSRF protection (Next.js default)
- [ ] Sanitize all user inputs
- [ ] Encrypt PII fields in MongoDB
- [ ] Set up MongoDB field-level encryption
- [ ] Review authentication implementation
- [ ] Test for SQL/NoSQL injection
- [ ] Configure security headers
- [ ] Set up dependency vulnerability scanning

### Performance

- [ ] Optimize MongoDB queries
- [ ] Add database query caching
- [ ] Implement lazy loading for large lists
- [ ] Optimize images (if any)
- [ ] Minimize JavaScript bundle size
- [ ] Add service worker for offline capability (optional)
- [ ] Configure CDN for static assets
- [ ] Test Lighthouse scores (aim for 90+)

### Compliance

- [ ] Add privacy policy page
- [ ] Add terms of service page
- [ ] Implement cookie consent (if using cookies)
- [ ] Add unsubscribe link to all emails
- [ ] Set up email bounce handling
- [ ] Create data retention policy
- [ ] Implement data deletion workflow
- [ ] Verify CAN-SPAM compliance
- [ ] Verify GDPR compliance (if EU users)

---

## Post-Launch Maintenance

### Week 1 After Launch

- [ ] Monitor cron job execution
- [ ] Review error logs daily
- [ ] Check email deliverability metrics
- [ ] Gather client feedback
- [ ] Fix any critical bugs
- [ ] Monitor API usage and costs

### Week 2-4 After Launch

- [ ] Review dashboard analytics
- [ ] Optimize based on user behavior
- [ ] Tune scoring algorithm if needed
- [ ] Update OpenAI prompts based on results
- [ ] Add requested features from client
- [ ] Conduct performance review

### Monthly Tasks

- [ ] Review scoring algorithm performance
- [ ] Update sector/stage classifications
- [ ] Audit suppression list
- [ ] Review outreach analytics
- [ ] Check API rate limits and costs
- [ ] MongoDB backup verification
- [ ] Security audit

### Quarterly Tasks

- [ ] OpenAI prompt optimization
- [ ] Crunchbase query refinement
- [ ] Dashboard UX improvements
- [ ] Dependency updates
- [ ] Comprehensive security review
- [ ] Client satisfaction survey

---

## Notes & Issues

Use this space to track issues, blockers, or notes during development:

```
[Date] - [Issue/Note]
Example:
2025-10-25 - Crunchbase rate limit hit during testing; implemented exponential backoff
2025-10-26 - Client requested additional filter for investment size
```

---

## Sign-Off

### Development Team

- [ ] All features implemented and tested
- [ ] Code reviewed and merged
- [ ] Documentation complete
- [ ] Deployed to production

**Signed**: ******\_\_\_\_******  
**Date**: ******\_\_\_\_******

### Client Approval

- [ ] Training completed
- [ ] Dashboard access verified
- [ ] All requirements met
- [ ] Ready for production use

**Signed**: ******\_\_\_\_******  
**Date**: ******\_\_\_\_******

---

**Progress Tracking**: 0/XXX tasks completed

**Current Phase**: Week 1 - Infrastructure Setup

**Last Updated**: October 25, 2025

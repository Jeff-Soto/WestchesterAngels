# AI Investor Prospecting Engine

> An intelligent platform for discovering, enriching, and prioritizing prospective investors using AI and real-time data.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-proprietary-red)

---

## 🎯 Project Overview

The AI Investor Prospecting Engine helps **Westchester Angels** discover, verify, and prioritize relevant investors using a multi-source approach with AI-powered verification. The system:

- 🔍 **Collects** from multiple FREE sources (public lists, firm pages, client CSVs)
- 🤖 **Verifies** data accuracy using AI ("same person?" matching across sources)
- ✅ **Human-validates** uncertain records via "Data Inbox" for quality assurance
- 🎯 **Ranks** sources by authority (firm page > personal site > directory)
- 📊 **Scores** each prospect (0-100) based on sector, stage, geography, and affiliation
- 💬 **Generates** personalized outreach message suggestions
- 📧 **Facilitates** email campaigns via Constant Contact
- 📈 **Tracks** engagement and verification history

---

## ✨ Key Features

### Multi-Source Data Collection

- Public investor lists (OpenVC directories, NYC angel networks)
- Firm team page scraping (on-demand)
- Client CSV uploads (events, conferences, referrals)
- Automated weekly collection + on-demand imports

### AI-Powered Verification

- "Same person?" matching across sources
- Source authority ranking (firm > personal > directory)
- Confidence scoring (0-100) for each field
- Automatic conflict detection and flagging

### Human-in-the-Loop Quality

- **Data Inbox**: Review uncertain records
- Side-by-side candidate comparison
- Quick approve/correct interface
- Full verification audit trail

### Smart Scoring & Insights

- Multi-factor fit scoring (sector, stage, geography, affiliation)
- AI-generated rationale for each prospect
- Suggested personalized outreach messages
- Historical score tracking

### Powerful Dashboard

- Real-time filtering by sector, location, and score
- Advanced search capabilities
- Prospect detail views with enrichment data
- Export to CSV

### Integrated Outreach

- Constant Contact integration for email campaigns
- AI-generated personalized message templates
- CSV export for bulk outreach
- Open/reply tracking
- CAN-SPAM/GDPR compliant

### Secure & Compliant

- Passwordless authentication
- WordPress iframe integration
- PII encryption at rest
- Comprehensive audit logging

---

## 🏗️ Technology Stack

- **Frontend**: Next.js 15 (App Router, JavaScript)
- **Database**: MongoDB Atlas
- **AI Engine**: OpenAI GPT-4
- **Primary Data Source**: OpenVC (API/CSV)
- **Optional Enrichment**: People Data Labs, Apollo.io
- **Email**: Constant Contact (primary) / SendGrid
- **Authentication**: NextAuth.js
- **Hosting**: Vercel
- **Scheduler**: Vercel Cron Jobs

---

## 📁 Project Structure

```
WestchesterAngels/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API endpoints
│   │   ├── dashboard/    # Main dashboard UI
│   │   └── login/        # Authentication
│   ├── lib/              # Shared utilities
│   │   ├── mongodb.js    # Database connection
│   │   ├── openvc.js     # OpenVC API client
│   │   ├── openai.js     # OpenAI helpers
│   │   ├── enrichment.js # People Data Labs/Apollo
│   │   ├── scoring.js    # Fit score algorithm
│   │   └── email.js      # Constant Contact integration
│   └── middleware.js     # Auth protection
├── public/               # Static assets
├── scripts/              # Utility scripts
├── TECHNICAL_SPEC.md     # Detailed technical documentation
└── README.md             # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22+ installed (LTS recommended)
- MongoDB Atlas account
- OpenVC API key or CSV access
- OpenAI API key
- Constant Contact account
- (Optional) People Data Labs or Apollo API keys for contact enrichment

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd WestchesterAngels
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```bash
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
OPENVC_API_KEY=...
OPENAI_API_KEY=sk-...
CONSTANT_CONTACT_API_KEY=...
PEOPLE_DATA_LABS_API_KEY=...  # Optional
APOLLO_API_KEY=...             # Optional
```

4. **Initialize the database**

```bash
npm run seed-db
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Documentation

For detailed technical information, see:

- **[TECHNICAL_SPEC.md](TECHNICAL_SPEC.md)** - Complete technical specification including:
  - Architecture diagrams
  - Database schemas
  - API integration details
  - Security & compliance guidelines
  - Implementation roadmap
  - Scoring algorithm
  - Email templates
  - Troubleshooting guide

---

## 🔐 Security

This project follows security best practices:

- All API keys stored in environment variables
- PII encrypted at rest in MongoDB
- Passwordless authentication with magic links
- HTTPS-only communication
- Rate limiting on all endpoints
- Regular security audits

**Never commit `.env.local` or any files containing secrets to version control.**

---

## 🧪 Testing

### Run Tests

```bash
npm run test           # Run all tests
npm run test:unit      # Unit tests only
npm run test:e2e       # End-to-end tests
```

### Manual Testing

```bash
npm run test:cron      # Test cron job locally
npm run test:scoring   # Test scoring algorithm
npm run test:email     # Test email sending
```

---

## 📦 Deployment

### Vercel Deployment

1. **Connect to Vercel**

```bash
npm install -g vercel
vercel login
vercel
```

2. **Add Environment Variables**

- Go to Vercel Dashboard → Settings → Environment Variables
- Add all variables from `.env.local`

3. **Configure Custom Domain**

- Add custom domain in Vercel (e.g., investors.clientdomain.com)
- Update DNS records as instructed

4. **Enable Cron Jobs**

- Cron configuration in `vercel.json` is automatically detected
- Monitor cron execution in Vercel Dashboard → Cron

### Production Checklist

- [ ] All environment variables configured
- [ ] Custom domain added and SSL active
- [ ] MongoDB Atlas IP whitelist updated
- [ ] Cron job tested and running
- [ ] Email domain authenticated (SPF/DKIM)
- [ ] WordPress iframe embed code provided
- [ ] Client admin account created
- [ ] User documentation delivered

---

## 🔄 Maintenance

### Automated (No Action Required)

- ✅ Weekly data import from OpenVC (Sundays 2 AM UTC)
- ✅ AI-powered fit scoring and message generation
- ✅ Database backups (MongoDB Atlas automated)
- ✅ SSL certificate renewal (Vercel managed)

### Monthly Tasks

- Review scoring algorithm performance
- Check email deliverability metrics
- Audit suppression list
- Review system logs for errors

### Quarterly Tasks

- Update OpenAI prompts if needed
- Review OpenVC data quality and coverage
- Optimize enrichment strategy
- Security audit
- Client feedback review

---

## 📊 Success Metrics

Track these KPIs in the dashboard:

- **Data Quality**: Prospects ingested per week, enrichment success rate
- **User Engagement**: Dashboard logins, filters used, exports
- **Outreach Performance**: Emails sent, open rate, reply rate
- **System Health**: Uptime, API response times, error rate

---

## 🛠️ Troubleshooting

### Common Issues

**Cron job not running?**

- Check Vercel cron logs in dashboard
- Verify `CRON_SECRET` environment variable
- Test manual trigger: `/api/admin/trigger-refresh`

**Low fit scores?**

- Review client profile settings in dashboard
- Check scoring weights in `src/lib/scoring.js`

**Email bounces?**

- Verify domain authentication (SPF/DKIM)
- Check suppression list
- Test with [mail-tester.com](https://www.mail-tester.com)

**Dashboard not loading?**

- Check MongoDB connection
- Verify all environment variables set
- Review Vercel function logs

See [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md#troubleshooting-guide) for detailed troubleshooting.

---

## 🗺️ Roadmap

### Phase 1: MVP (Weeks 1-4) ✅ In Progress

- [x] Project setup and infrastructure
- [x] Dashboard UI with collapsible analytics
- [ ] OpenVC integration
- [ ] Optional contact enrichment (People Data Labs/Apollo)
- [ ] AI fit scoring and message generation
- [ ] WordPress iframe integration
- [ ] Constant Contact integration

### Phase 2: Enhancements (Post-Launch)

- [ ] Slack notifications
- [ ] Chrome extension
- [ ] AI email draft suggestions
- [ ] Calendar integration
- [ ] CRM integration (HubSpot/Salesforce)

### Phase 3: Advanced Features

- [ ] Machine learning optimization
- [ ] Sentiment analysis
- [ ] Competitive intelligence
- [ ] Network mapping
- [ ] Automated warm intro pathfinding

---

## 👥 Team

**Client**: Westchester Angels  
**Development**: [Your Company Name]  
**Primary Contact**: [Client Name & Email]

---

## 📄 License

This project is proprietary and confidential. All rights reserved.  
© 2025 Westchester Angels

---

## 🆘 Support

- **Technical Issues**: Create an issue in this repository
- **Email Support**: support@yourdomain.com
- **Documentation**: See [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md)
- **Client Portal**: [Link to client portal]

---

## 🙏 Acknowledgments

- OpenVC for investor database
- OpenAI for AI-powered scoring and insights
- People Data Labs & Apollo.io for contact enrichment
- Constant Contact for email campaigns
- Vercel for hosting and deployment
- MongoDB for database services

---

**Status**: 🚧 Active Development - Architecture Pivot  
**Last Updated**: October 31, 2025  
**Version**: 1.2.0-alpha (Major Architecture Update)

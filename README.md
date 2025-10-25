# AI Investor Prospecting Engine

> An intelligent platform for discovering, enriching, and prioritizing prospective investors using AI and real-time data.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-proprietary-red)

---

## 🎯 Project Overview

The AI Investor Prospecting Engine helps **Westchester Angels** identify and prioritize the most relevant investors for their portfolio companies. The system automatically:

- 🔍 **Discovers** investors from Crunchbase based on sector and geography
- 🤖 **Enriches** profiles using OpenAI to extract insights
- 📊 **Scores** each prospect based on fit (0-100)
- 🎯 **Prioritizes** the best matches for outreach
- 📧 **Facilitates** email outreach campaigns
- 📈 **Tracks** engagement and results

---

## ✨ Key Features

### Automated Data Pipeline

- Weekly automated data refresh from Crunchbase
- AI-powered enrichment using OpenAI GPT-4
- Intelligent deduplication and normalization

### Smart Scoring

- Multi-factor fit scoring (sector, stage, geography, check size)
- AI-generated rationale for each score
- Historical score tracking

### Powerful Dashboard

- Real-time filtering by sector, location, and score
- Advanced search capabilities
- Prospect detail views with enrichment data
- Export to CSV

### Integrated Outreach

- Email campaign management
- Template system with personalization
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
- **Data Source**: Crunchbase API
- **Email**: SendGrid / Constant Contact
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
│   │   ├── crunchbase.js # Crunchbase API client
│   │   ├── openai.js     # OpenAI helpers
│   │   └── scoring.js    # Fit score algorithm
│   └── middleware.js     # Auth protection
├── public/               # Static assets
├── scripts/              # Utility scripts
├── TECHNICAL_SPEC.md     # Detailed technical documentation
└── README.md             # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ installed (LTS recommended)
- MongoDB Atlas account
- Crunchbase API key (Enterprise tier)
- OpenAI API key
- SendGrid or Constant Contact account

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
CRUNCHBASE_API_KEY=...
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG...
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

- ✅ Weekly data refresh from Crunchbase (Sundays 2 AM UTC)
- ✅ Database backups (MongoDB Atlas automated)
- ✅ SSL certificate renewal (Vercel managed)

### Monthly Tasks

- Review scoring algorithm performance
- Check email deliverability metrics
- Audit suppression list
- Review system logs for errors

### Quarterly Tasks

- Update OpenAI prompts if needed
- Optimize Crunchbase queries
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
- [ ] Crunchbase integration
- [ ] AI enrichment pipeline
- [ ] Dashboard UI
- [ ] WordPress integration

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

- Crunchbase for investor data
- OpenAI for AI enrichment
- Vercel for hosting and deployment
- MongoDB for database services

---

**Status**: 🚧 Active Development  
**Last Updated**: October 25, 2025  
**Version**: 1.0.0-alpha

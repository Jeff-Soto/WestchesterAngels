# Quick Start Guide

**Get up and running with the AI Investor Prospecting Engine in 15 minutes.**

---

## Prerequisites

✅ Node.js 20+ installed (LTS recommended)  
✅ MongoDB Atlas account  
✅ API keys (OpenVC, OpenAI, Constant Contact)

---

## Installation (5 minutes)

### 1. Clone & Install

```bash
git clone <repository-url>
cd WestchesterAngels
npm install
```

### 2. Configure Environment

Create `.env.local` in the root directory:

```bash
# Essential variables only - see ENV_SETUP.md for full list
MONGODB_URI=mongodb+srv://your-connection-string
NEXTAUTH_SECRET=generate-random-32-char-string
NEXTAUTH_URL=http://localhost:3000
OPENVC_API_KEY=your-openvc-key
OPENAI_API_KEY=sk-your-openai-key
CONSTANT_CONTACT_API_KEY=your-constant-contact-key
CRON_SECRET=another-random-string
```

**Generate secrets:**

```bash
# Mac/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 3. Initialize Database

```bash
npm run seed-db
```

### 4. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## Project Structure (2 minutes)

```
WestchesterAngels/
├── src/
│   ├── app/
│   │   ├── api/          # Backend endpoints
│   │   └── dashboard/    # Frontend UI
│   └── lib/              # Utilities (DB, APIs, scoring)
├── scripts/              # Helper scripts
├── TECHNICAL_SPEC.md     # Full documentation
└── README.md             # Overview
```

---

## Key Files to Know

| File                                     | Purpose                       |
| ---------------------------------------- | ----------------------------- |
| `src/lib/mongodb.js`                     | Database connection           |
| `src/lib/openvc.js`                      | OpenVC API client             |
| `src/lib/openai.js`                      | AI scoring helpers            |
| `src/lib/enrichment.js`                  | Contact enrichment (optional) |
| `src/lib/scoring.js`                     | Fit score algorithm           |
| `src/app/api/cron/refresh-data/route.js` | Weekly data pipeline          |
| `src/app/dashboard/page.js`              | Main dashboard UI             |

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run start            # Run production build

# Database
npm run seed-db          # Initialize MongoDB collections

# Testing
npm run test:cron        # Test cron job locally
npm run lint             # Check code quality

# Deployment
vercel                   # Deploy to Vercel
vercel logs              # View deployment logs
```

---

## Development Workflow (5 minutes)

### 1. Create a Feature Branch

```bash
git checkout -b feature/my-feature
```

### 2. Make Changes

Edit files in `src/app/` or `src/lib/`

### 3. Test Locally

```bash
npm run dev
# Visit http://localhost:3000
```

### 4. Commit & Push

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature
```

### 5. Create Pull Request

Open PR on GitHub targeting `develop` branch

---

## Testing Your Changes

### Test API Endpoints

```bash
# Get all prospects
curl http://localhost:3000/api/prospects

# Get single prospect
curl http://localhost:3000/api/prospects/[id]
```

### Test Cron Job

```bash
npm run test:cron
```

### Check Database

```bash
# Using MongoDB Compass, connect to your MONGODB_URI
# Browse collections: prospects, scores, outreach
```

---

## Deploying to Vercel (3 minutes)

### First-Time Setup

```bash
npm install -g vercel
vercel login
vercel
# Follow prompts
```

### Add Environment Variables

In Vercel Dashboard:

1. Go to Settings → Environment Variables
2. Add each variable from `.env.local`
3. Select "Production, Preview, Development"

### Deploy

```bash
git push origin main
# Auto-deploys on push
```

Or manually:

```bash
vercel --prod
```

---

## Troubleshooting

### Can't connect to MongoDB?

- Check connection string format
- Verify network access whitelist (0.0.0.0/0)
- Test with MongoDB Compass

### API keys not working?

- Verify keys are correct in `.env.local`
- Restart dev server after changing env vars
- Check for extra spaces/newlines

### Cron job failing?

- Check CRON_SECRET is set
- View logs: `vercel logs`
- Test locally: `npm run test:cron`

### Build errors?

```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## Next Steps

1. **Read the docs**

   - [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md) - Complete technical reference
   - [ENV_SETUP.md](ENV_SETUP.md) - Detailed environment setup
   - [DEVELOPMENT_CHECKLIST.md](DEVELOPMENT_CHECKLIST.md) - Task tracking

2. **Explore the code**

   - Start with `src/app/dashboard/page.js`
   - Review `src/lib/scoring.js` for business logic
   - Check `src/app/api/cron/refresh-data/route.js` for data pipeline

3. **Join the team**
   - Read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
   - Set up your development environment
   - Pick a task from the checklist

---

## Essential Resources

- **Next.js Docs**: https://nextjs.org/docs
- **MongoDB Docs**: https://www.mongodb.com/docs/
- **Vercel Docs**: https://vercel.com/docs
- **OpenAI API**: https://platform.openai.com/docs
- **OpenVC**: https://www.openvc.app/
- **Constant Contact API**: https://developer.constantcontact.com/

---

## Getting Help

- **Documentation Issues**: Check [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md)
- **Environment Setup**: See [ENV_SETUP.md](ENV_SETUP.md)
- **Bug Reports**: Open a GitHub issue
- **Questions**: Email support@yourdomain.com

---

## Checklist for New Developers

- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] MongoDB connection tested
- [ ] Dev server running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Read TECHNICAL_SPEC.md
- [ ] Read CONTRIBUTING.md
- [ ] Made first test commit
- [ ] Deployed to Vercel (optional)

---

**Time to first commit**: ~15 minutes  
**Time to first deploy**: ~30 minutes

**You're ready to build!** 🚀

For detailed information, see:

- 📘 [README.md](README.md) - Project overview
- 📗 [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md) - Complete technical documentation
- 📕 [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines

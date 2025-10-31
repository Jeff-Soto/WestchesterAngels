# Environment Variables Setup Guide

This document explains how to configure environment variables for the AI Investor Prospecting Engine.

## Quick Start

1. Create a `.env.local` file in the root directory
2. Copy the template below and fill in your actual values
3. Never commit `.env.local` to version control (it's in .gitignore)

---

## Environment Variables Template

```bash
# =============================================================================
# DATABASE
# =============================================================================

# MongoDB Atlas connection string
# Get this from MongoDB Atlas Dashboard → Connect → Connect your application
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/investors?retryWrites=true&w=majority

# =============================================================================
# AUTHENTICATION
# =============================================================================

# NextAuth secret - generate a random string
# You can generate one using: openssl rand -base64 32
NEXTAUTH_SECRET=your-random-secret-here-min-32-chars

# Your application URL (change for production)
NEXTAUTH_URL=http://localhost:3000

# =============================================================================
# OPENVC API
# =============================================================================

# OpenVC API key for investor data
# Get this from: https://www.openvc.app/
OPENVC_API_KEY=your-openvc-api-key-here

# =============================================================================
# OPENAI API
# =============================================================================

# OpenAI API key for AI enrichment
# Get this from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-api-key-here

# =============================================================================
# EMAIL SERVICE
# =============================================================================

# Primary: Constant Contact
CONSTANT_CONTACT_API_KEY=your-constant-contact-key-here

# Alternative: SendGrid (optional)
# SENDGRID_API_KEY=SG.your-sendgrid-api-key-here

# =============================================================================
# OPTIONAL: CONTACT ENRICHMENT SERVICES
# =============================================================================

# People Data Labs for contact enrichment (optional)
# Only needed if OpenVC data lacks email/LinkedIn info
# PEOPLE_DATA_LABS_API_KEY=your-people-data-labs-api-key-here

# Apollo.io for email verification (optional)
# APOLLO_API_KEY=your-apollo-api-key-here

# =============================================================================
# CRON JOB SECURITY
# =============================================================================

# Secret token to protect cron endpoints from unauthorized access
# Generate a random string: openssl rand -hex 32
CRON_SECRET=your-random-cron-secret-here

# =============================================================================
# CLIENT CONFIGURATION
# =============================================================================

# Client company name
CLIENT_NAME=Westchester Angels

# Primary sector focus (comma-separated if multiple)
CLIENT_SECTOR=Multi-sector

# Investment stage preferences (comma-separated)
CLIENT_STAGE=Seed,Series A

# Check size range (in USD)
CLIENT_CHECK_SIZE_MIN=250000
CLIENT_CHECK_SIZE_MAX=2000000

# Geographic focus
CLIENT_LOCATION_STATE=NY
CLIENT_LOCATION_CITY=New York
CLIENT_LOCATION_COUNTRY=US

# =============================================================================
# EMAIL CONFIGURATION
# =============================================================================

# Sender email address (must be verified with your email provider)
FROM_EMAIL=noreply@clientdomain.com

# Sender display name
FROM_NAME=Westchester Angels

# Support email for system notifications
SUPPORT_EMAIL=support@clientdomain.com

# =============================================================================
# APPLICATION SETTINGS
# =============================================================================

# Environment: development, production, or test
NODE_ENV=development

# Logging level: debug, info, warn, error
LOG_LEVEL=info

# Enable debug mode (outputs verbose logs)
DEBUG=false
```

---

## Obtaining API Keys

### 1. MongoDB Atlas

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M10 or higher recommended)
3. Go to "Database Access" → Create a database user
4. Go to "Network Access" → Add IP Address (allow from anywhere for Vercel: `0.0.0.0/0`)
5. Click "Connect" → "Connect your application" → Copy connection string
6. Replace `<password>` with your database user password

**Connection String Format:**

```
mongodb+srv://username:password@cluster.mongodb.net/investors?retryWrites=true&w=majority
```

---

### 2. NextAuth Secret

Generate a secure random string:

**Using OpenSSL (Mac/Linux):**

```bash
openssl rand -base64 32
```

**Using Node.js:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Using Online Tool:**

- Visit [generate-random.org/api-key-generator](https://www.generate-random.org/api-key-generator)
- Generate a 256-bit key

---

### 3. OpenVC API

1. Visit [openvc.app](https://www.openvc.app/)
2. Sign up for an account or API access
3. Contact OpenVC for API credentials or CSV export access
4. Copy your API key (if using API)

**Note**: OpenVC pricing varies by plan (~$199-499/month). Check current pricing at openvc.app.

---

### 4. OpenAI API

1. Create account at [platform.openai.com](https://platform.openai.com/)
2. Go to [API Keys](https://platform.openai.com/api-keys)
3. Click "Create new secret key"
4. Copy the key immediately (you won't be able to see it again)
5. Add billing information (pay-as-you-go)

**Estimated Cost**: ~$50-150/month depending on usage

---

### 5. Constant Contact (Primary Email Service)

1. Create account at [constantcontact.com](https://www.constantcontact.com/)
2. Go to Account → Integrations → API Keys
3. Generate API key
4. Copy the API key

**Required Setup:**

- Verify sender email
- Set up contact lists
- Configure email templates
- Enable email tracking

**Recommended Plan**: Core ($20/month)

---

### 6. SendGrid (Alternative Email Service)

1. Create account at [sendgrid.com](https://sendgrid.com/)
2. Go to Settings → API Keys
3. Click "Create API Key"
4. Choose "Full Access" or "Restricted Access" with Mail Send permissions
5. Copy the API key

**Required Setup:**

- Verify sender email or domain
- Set up domain authentication (SPF, DKIM)
- Configure unsubscribe groups

**Recommended Plan**: Essentials ($20/month for 50k emails)

---

### 7. People Data Labs (Optional - Contact Enrichment)

1. Create account at [peopledatalabs.com](https://www.peopledatalabs.com/)
2. Go to Dashboard → API Keys
3. Generate API key
4. Copy your API key

**Use Case**: Fill in missing email/LinkedIn data from OpenVC

**Cost**: Pay-as-you-go, ~$0.10-0.50 per enrichment

---

### 8. Apollo.io (Optional - Email Verification)

1. Create account at [apollo.io](https://www.apollo.io/)
2. Go to Settings → Integrations → API
3. Copy your API key

**Use Case**: Verify email deliverability and find alternative contacts

**Cost**: Varies by plan

---

## Vercel Deployment

When deploying to Vercel, add environment variables through the dashboard:

1. Go to your project on [vercel.com](https://vercel.com)
2. Settings → Environment Variables
3. Add each variable individually:
   - **Name**: MONGODB_URI
   - **Value**: your-connection-string
   - **Environment**: Production, Preview, Development (select all that apply)

### Using Vercel CLI

```bash
# Set a single variable
vercel env add MONGODB_URI production

# Pull environment variables to local
vercel env pull .env.local
```

---

## Security Best Practices

### ✅ DO:

- Store all secrets in environment variables
- Use strong, randomly generated secrets
- Rotate API keys every 90 days
- Use different keys for development and production
- Enable 2FA on all API provider accounts
- Regularly audit API key usage
- Delete unused API keys immediately

### ❌ DON'T:

- Commit `.env.local` or `.env` files to Git
- Share API keys via email or Slack
- Use the same keys across multiple projects
- Hardcode secrets in your code
- Store secrets in client-side code
- Push secrets to public repositories

---

## Validation

Test your environment setup:

```bash
# Install dependencies
npm install

# Test MongoDB connection
node -e "require('./src/lib/mongodb').connectToDatabase().then(() => console.log('✅ MongoDB connected')).catch(e => console.error('❌ MongoDB failed:', e.message))"

# Test OpenVC API
node scripts/test-openvc.js

# Test OpenAI API
node scripts/test-openai.js

# Run development server
npm run dev
```

If all tests pass, you're ready to go! 🎉

---

## Troubleshooting

### MongoDB Connection Failed

**Error**: `MongoServerError: bad auth`

- Check username and password in connection string
- Ensure database user exists in MongoDB Atlas
- Verify password doesn't contain special characters (URL encode if needed)

**Error**: `MongoNetworkError: connection timed out`

- Check Network Access whitelist in MongoDB Atlas
- Add `0.0.0.0/0` to allow connections from anywhere
- Verify firewall isn't blocking port 27017

---

### NextAuth Errors

**Error**: `[next-auth][error][NO_SECRET]`

- Ensure `NEXTAUTH_SECRET` is set
- Verify it's at least 32 characters
- Check for typos in variable name

**Error**: `[next-auth][error][INVALID_URL]`

- Ensure `NEXTAUTH_URL` matches your domain
- Include protocol (http:// or https://)
- No trailing slash

---

### OpenVC API Errors

**Error**: `401 Unauthorized`

- Verify API key is correct
- Check if API key has been revoked
- Ensure subscription is active

**Error**: `429 Too Many Requests`

- Rate limit exceeded
- Implement exponential backoff
- Check for infinite loops in cron job
- Contact OpenVC about rate limits

**Error**: `Invalid CSV format`

- Verify CSV structure matches expected format
- Check for encoding issues (use UTF-8)
- Validate required columns are present

---

### OpenAI API Errors

**Error**: `401 Incorrect API key`

- Verify API key starts with `sk-`
- Check for extra spaces or newlines
- Generate a new key if needed

**Error**: `429 Rate limit exceeded`

- Increase rate limits in OpenAI dashboard
- Implement request batching
- Add delays between requests

**Error**: `Billing hard limit reached`

- Add payment method in OpenAI dashboard
- Set usage limits
- Monitor usage at [platform.openai.com/usage](https://platform.openai.com/usage)

---

### SendGrid Errors

**Error**: `403 Forbidden`

- Verify sender email is authenticated
- Check API key permissions
- Ensure account is not suspended

**Error**: `Sender address not verified`

- Go to SendGrid → Settings → Sender Authentication
- Complete single sender verification or domain authentication
- Wait for DNS propagation (24-48 hours)

---

## Environment-Specific Configuration

### Development (.env.local)

```bash
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
LOG_LEVEL=debug
DEBUG=true
```

### Production (Vercel)

```bash
NODE_ENV=production
NEXTAUTH_URL=https://investors.clientdomain.com
LOG_LEVEL=info
DEBUG=false
```

### Testing (.env.test)

```bash
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/investors-test
LOG_LEVEL=error
```

---

## Need Help?

- **Documentation**: See [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md)
- **Support**: support@yourdomain.com
- **Issues**: Create an issue in this repository

---

**Last Updated**: October 27, 2025  
**Document Version**: 1.1

# Contributing to AI Investor Prospecting Engine

Thank you for contributing to the Westchester Angels AI Investor Prospecting Engine! This document provides guidelines and best practices for development.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Git Workflow](#git-workflow)
5. [Testing Guidelines](#testing-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Common Tasks](#common-tasks)

---

## Getting Started

### Prerequisites

- Node.js 20+ and npm 10+ (LTS recommended)
- Git
- Code editor (VS Code recommended)
- MongoDB Compass (for database inspection)
- Postman or similar (for API testing)

### Initial Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd WestchesterAngels
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
# Copy the template and fill in your values
cp ENV_SETUP.md reference
# Create .env.local with your API keys (see ENV_SETUP.md)
```

4. **Initialize database**

```bash
npm run seed-db
```

5. **Start development server**

```bash
npm run dev
```

Visit http://localhost:3000 to verify everything works.

---

## Development Workflow

### Branch Strategy

We use a feature branch workflow:

```
main (production)
  └── develop (staging)
       ├── feature/dashboard-filters
       ├── feature/ai-enrichment
       └── bugfix/scoring-calculation
```

### Creating a New Feature

1. **Create a branch from `develop`**

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

2. **Make your changes**

   - Write code
   - Add tests
   - Update documentation

3. **Commit frequently**

```bash
git add .
git commit -m "feat: add sector filter to dashboard"
```

4. **Push to remote**

```bash
git push origin feature/your-feature-name
```

5. **Create a Pull Request** (see [Pull Request Process](#pull-request-process))

---

## Code Standards

### JavaScript Style Guide

We follow **ESLint** recommendations with Next.js best practices.

**Key Rules:**

1. **No semicolons** (or always use them - be consistent)
2. **Single quotes** for strings
3. **2 spaces** for indentation
4. **camelCase** for variables and functions
5. **PascalCase** for components
6. **UPPER_CASE** for constants

**Example:**

```javascript
// ✅ Good
const API_KEY = process.env.CRUNCHBASE_API_KEY;

function fetchProspects(filters) {
  return db.collection('prospects').find(filters);
}

export default function ProspectCard({ prospect }) {
  return <div>{prospect.name}</div>;
}

// ❌ Bad
const apiKey = process.env.CRUNCHBASE_API_KEY; // constant should be UPPER_CASE
function FetchProspects(filters) {} // function should be camelCase
export default function prospectCard() {} // component should be PascalCase
```

### File Naming Conventions

- **Components**: PascalCase - `ProspectTable.js`, `FilterPanel.js`
- **Utilities**: camelCase - `mongodb.js`, `scoring.js`
- **API Routes**: kebab-case - `refresh-data/route.js`
- **Pages**: kebab-case - `dashboard/page.js`

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── prospects/     # RESTful resource routes
│   │   └── cron/          # Scheduled jobs
│   ├── dashboard/         # Dashboard pages
│   └── login/             # Auth pages
├── lib/                   # Shared utilities
│   ├── mongodb.js         # Database connection
│   ├── crunchbase.js      # External API client
│   └── scoring.js         # Business logic
└── middleware.js          # Auth middleware
```

---

## Git Workflow

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring without functionality change
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(dashboard): add sector filter dropdown

fix(scoring): correct check size match calculation

docs(readme): update installation instructions

refactor(api): extract Crunchbase logic to lib

test(scoring): add unit tests for fit score

chore(deps): update Next.js to 14.0.5
```

### Branch Naming

```
feature/<description>  # New features
bugfix/<description>   # Bug fixes
hotfix/<description>   # Critical production fixes
refactor/<description> # Code improvements
docs/<description>     # Documentation updates
```

**Examples:**

- `feature/add-csv-upload`
- `bugfix/fix-email-template`
- `hotfix/urgent-cron-failure`
- `refactor/optimize-queries`
- `docs/update-api-docs`

### Before Committing

1. **Lint your code**

```bash
npm run lint
```

2. **Format your code** (if using Prettier)

```bash
npm run format
```

3. **Test your changes**

```bash
npm test
```

4. **Review your diff**

```bash
git diff
```

---

## Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Works on Chrome, Firefox, Safari
- [ ] Responsive on mobile/tablet
- [ ] Authentication still works
- [ ] Existing features not broken

### Testing API Endpoints

Use Postman or curl:

```bash
# Test prospect retrieval
curl http://localhost:3000/api/prospects

# Test enrichment endpoint
curl -X POST http://localhost:3000/api/enrich \
  -H "Content-Type: application/json" \
  -d '{"prospectId": "123"}'
```

### Testing Database Operations

Use MongoDB Compass or mongo shell:

```javascript
// Connect to database
use investors

// Check prospects
db.prospects.find().limit(5)

// Check scores
db.scores.find().sort({computed_at: -1}).limit(5)

// Check logs
db.logs.find({level: "error"}).limit(10)
```

---

## Pull Request Process

### Before Creating a PR

1. **Sync with latest develop**

```bash
git checkout develop
git pull origin develop
git checkout your-feature-branch
git merge develop
# Resolve any conflicts
```

2. **Ensure quality**

   - [ ] All tests pass
   - [ ] No linting errors
   - [ ] Code is documented
   - [ ] Changes are tested

3. **Update documentation**
   - Update README if needed
   - Update TECHNICAL_SPEC if architecture changed
   - Add comments to complex code

### Creating the PR

1. **Push your branch**

```bash
git push origin feature/your-feature
```

2. **Open PR on GitHub**

   - Go to repository
   - Click "New Pull Request"
   - Select `develop` as base branch
   - Select your feature branch

3. **Fill out PR template**

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring

## Testing

- [ ] Manual testing completed
- [ ] Existing features verified

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added to complex code
- [ ] Documentation updated
- [ ] No console errors
```

### PR Review Process

1. **Automated checks** must pass (linting, build)
2. **Code review** by at least one team member
3. **Testing** by reviewer
4. **Approval** before merging

### Addressing Feedback

```bash
# Make requested changes
git add .
git commit -m "fix: address PR feedback"
git push origin feature/your-feature
# PR will auto-update
```

### Merging

Once approved:

- **Squash and merge** for feature branches
- **Merge commit** for release branches
- **Delete branch** after merging

---

## Common Tasks

### Adding a New API Endpoint

1. **Create route file**

```bash
# Example: /api/investors
touch src/app/api/investors/route.js
```

2. **Implement handler**

```javascript
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const db = await connectToDatabase();
    const investors = await db.collection("prospects").find({}).toArray();
    return NextResponse.json(investors);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

3. **Test endpoint**

```bash
curl http://localhost:3000/api/investors
```

4. **Document in TECHNICAL_SPEC.md**

---

### Adding a New Component

1. **Create component file**

```bash
touch src/app/dashboard/components/NewComponent.js
```

2. **Implement component**

```javascript
export default function NewComponent({ data }) {
  return <div>{/* Component content */}</div>;
}
```

3. **Import and use**

```javascript
import NewComponent from "./components/NewComponent";

export default function Dashboard() {
  return <NewComponent data={data} />;
}
```

---

### Modifying the Scoring Algorithm

1. **Update weights** in `src/lib/scoring.js`

```javascript
const WEIGHTS = {
  sector_match: 0.35, // Changed from 0.30
  // ...
};
```

2. **Update version**

```javascript
const SCORING_VERSION = "1.1"; // Increment version
```

3. **Test thoroughly**

```bash
npm run test:scoring
```

4. **Document changes** in TECHNICAL_SPEC.md

---

### Adding a New Database Collection

1. **Update schema** in TECHNICAL_SPEC.md

```markdown
### Collection: `new_collection`
```

2. **Create indexes**

```javascript
// In scripts/seed-db.js
await db.collection("new_collection").createIndex({ field: 1 });
```

3. **Add helper functions** in `src/lib/mongodb.js` if needed

---

### Debugging Tips

#### Enable Debug Logging

```javascript
// In any file
console.log("[DEBUG]", variable);

// Or use environment variable
if (process.env.DEBUG === "true") {
  console.log("Debug info");
}
```

#### Check Vercel Logs

```bash
vercel logs <deployment-url>
```

#### MongoDB Query Profiling

```javascript
// In mongo shell
db.setProfilingLevel(2);
db.system.profile.find().sort({ ts: -1 }).limit(5);
```

#### Network Debugging

```javascript
// In browser console
performance.getEntriesByType("resource").forEach((entry) => {
  console.log(entry.name, entry.duration);
});
```

---

## Environment-Specific Configuration

### Development

```javascript
if (process.env.NODE_ENV === "development") {
  // Development-only code
}
```

### Production

```javascript
if (process.env.NODE_ENV === "production") {
  // Production-only code
}
```

---

## Performance Best Practices

1. **Database Queries**
   - Always use indexes
   - Limit results with `.limit()`
   - Project only needed fields

```javascript
// ✅ Good
db.collection("prospects")
  .find({ sector: "FinTech" })
  .project({ name: 1, org: 1, fit_score: 1 })
  .limit(50);

// ❌ Bad
db.collection("prospects").find({}).toArray();
```

2. **API Calls**
   - Batch requests when possible
   - Implement caching
   - Use exponential backoff

```javascript
// ✅ Good
const cache = new Map();
async function fetchWithCache(key, fetcher) {
  if (cache.has(key)) return cache.get(key);
  const data = await fetcher();
  cache.set(key, data);
  return data;
}
```

3. **React Components**
   - Avoid unnecessary re-renders
   - Use proper key props in lists
   - Memoize expensive computations

---

## Security Checklist

Before deploying:

- [ ] No API keys in code
- [ ] All inputs sanitized
- [ ] Authentication on protected routes
- [ ] Rate limiting implemented
- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] Dependencies up to date
- [ ] No console.log with sensitive data

---

## Getting Help

### Resources

- **Technical Spec**: [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md)
- **Environment Setup**: [ENV_SETUP.md](ENV_SETUP.md)
- **Development Checklist**: [DEVELOPMENT_CHECKLIST.md](DEVELOPMENT_CHECKLIST.md)
- **Next.js Docs**: https://nextjs.org/docs
- **MongoDB Docs**: https://www.mongodb.com/docs/

### Contact

- **Team Lead**: [Name & Email]
- **Tech Support**: support@yourdomain.com
- **Slack Channel**: #westchester-angels-dev (if applicable)

---

## Code Review Guidelines

### For Authors

- Keep PRs focused and small
- Provide context in PR description
- Respond to feedback promptly
- Don't take feedback personally

### For Reviewers

- Be constructive and specific
- Suggest improvements, don't just criticize
- Acknowledge good code
- Test the changes locally

---

## License

This is a proprietary project. All code is confidential and owned by Westchester Angels.

---

**Questions?** Open an issue or contact the team lead.

**Happy coding!** 🚀

// Mock data using REAL tri-state angel investors

// Real investor data sourced from NYC angel ecosystem
const realInvestors = [
  {
    name: 'Joanne Wilson',
    org: 'Gotham Gal Ventures',
    bio: 'NYC super-angel; 140+ portfolio; focus on women-led and consumer',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed', 'Series A'],
    sectors: ['Consumer', 'Marketplaces', 'Media'],
    email: 'joanne@gothamgal.com',
    linkedin: 'linkedin.com/in/joannewilson',
  },
  {
    name: 'Brian Cohen',
    org: 'New York Angels',
    bio: 'First investor in Pinterest; longtime New York Angels leader',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed'],
    sectors: ['Consumer', 'Media', 'Platforms'],
    email: 'brian@newyorkangels.com',
    linkedin: 'linkedin.com/in/briancohen',
  },
  {
    name: 'David S. Rose',
    org: 'Rose Tech Ventures',
    bio: 'Founder of Gust; "New York\'s Archangel"; funded 100+ companies',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed', 'Series A'],
    sectors: ['FinTech', 'PropTech', 'Enterprise Software'],
    email: 'david@rosetech.com',
    linkedin: 'linkedin.com/in/davidsrose',
  },
  {
    name: 'Fabrice Grinda',
    org: 'FJ Labs',
    bio: 'Super angel; 200+ investments; co-founded OLX',
    location: { city: 'New York', state: 'NY' },
    stages: ['Pre-Seed', 'Seed'],
    sectors: ['Marketplaces', 'Consumer', 'FinTech'],
    email: 'fabrice@fjlabs.com',
    linkedin: 'linkedin.com/in/fabricegrinda',
  },
  {
    name: 'David Tisch',
    org: 'BoxGroup',
    bio: 'Managing Partner at BoxGroup; prolific NYC seed investor',
    location: { city: 'New York', state: 'NY' },
    stages: ['Pre-Seed', 'Seed'],
    sectors: ['Consumer', 'SaaS', 'FinTech'],
    email: 'david@boxgroup.com',
    linkedin: 'linkedin.com/in/davidtisch',
  },
  {
    name: 'Alex Iskold',
    org: '2048 Ventures',
    bio: 'Ex–Techstars NYC MD; first-check investor',
    location: { city: 'New York', state: 'NY' },
    stages: ['Pre-Seed', 'Seed'],
    sectors: ['B2B SaaS', 'Developer Tools', 'FinTech'],
    email: 'alex@2048.vc',
    linkedin: 'linkedin.com/in/alexiskold',
  },
  {
    name: 'Jenny Fielding',
    org: 'Everywhere Ventures',
    bio: 'Co-founded Everywhere Ventures; first-check operator angel',
    location: { city: 'New York', state: 'NY' },
    stages: ['Pre-Seed', 'Seed'],
    sectors: ['FinTech', 'SaaS', 'HealthTech', 'Consumer'],
    email: 'jenny@everywhere.vc',
    linkedin: 'linkedin.com/in/jennyfielding',
  },
  {
    name: 'Gary Vaynerchuk',
    org: 'VaynerX',
    bio: 'Early investor in Facebook/Twitter/Uber; media entrepreneur',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed', 'Series A'],
    sectors: ['Consumer', 'Media', 'Web3'],
    email: 'gary@vaynermedia.com',
    linkedin: 'linkedin.com/in/garyvaynerchuk',
  },
  {
    name: 'Esther Dyson',
    org: 'Wellville',
    bio: 'Veteran angel; focus on health tech, biotech, and gov/open data',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed', 'Series A'],
    sectors: ['HealthTech', 'BioTech', 'GovTech'],
    email: 'esther@wellville.net',
    linkedin: 'linkedin.com/in/estherdyson',
  },
  {
    name: 'Fred Wilson',
    org: 'Union Square Ventures',
    bio: 'USV partner; NYC seed/Series A mainstay; prolific early internet investor',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed', 'Series A'],
    sectors: ['Consumer Internet', 'Platforms', 'Crypto'],
    email: 'fred@usv.com',
    linkedin: 'linkedin.com/in/fredwilson',
  },
  {
    name: 'Albert Wenger',
    org: 'Union Square Ventures',
    bio: 'USV managing partner; early angel in Etsy/Tumblr',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed', 'Series A'],
    sectors: ['Enterprise Software', 'Marketplaces'],
    email: 'albert@usv.com',
    linkedin: 'linkedin.com/in/albertwenger',
  },
  {
    name: 'Ben Lerer',
    org: 'Lerer Hippeau',
    bio: 'Co-founder of Lerer Hippeau; long-time NYC seed investor',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed'],
    sectors: ['Consumer', 'Media', 'E-commerce'],
    email: 'ben@lererhippeau.com',
    linkedin: 'linkedin.com/in/benlerer',
  },
  {
    name: 'Kevin Ryan',
    org: 'AlleyCorp',
    bio: 'AlleyCorp founder; repeat NYC founder/investor (MongoDB, BI, Gilt)',
    location: { city: 'New York', state: 'NY' },
    stages: ['Pre-Seed', 'Seed'],
    sectors: ['Consumer', 'FinTech', 'HealthTech'],
    email: 'kevin@alleycorp.com',
    linkedin: 'linkedin.com/in/kevinpryan',
  },
  {
    name: 'Nihal Mehta',
    org: 'Eniac Ventures',
    bio: 'ENIAC cofounder; early mobile/consumer investor',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed'],
    sectors: ['Mobile', 'FinTech', 'Consumer', 'AI/ML'],
    email: 'nihal@eniac.vc',
    linkedin: 'linkedin.com/in/nihalmehta',
  },
  {
    name: 'John Borthwick',
    org: 'betaworks',
    bio: 'betaworks founder; builder/investor in NYC consumer tech',
    location: { city: 'New York', state: 'NY' },
    stages: ['Pre-Seed', 'Seed'],
    sectors: ['Consumer', 'Media', 'AI/ML'],
    email: 'john@betaworks.com',
    linkedin: 'linkedin.com/in/borthwick',
  },
  {
    name: 'Bradley Tusk',
    org: 'Tusk Venture Partners',
    bio: 'Investor in regulated industries; political strategist turned VC',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed', 'Series A'],
    sectors: ['GovTech', 'Mobility', 'FinTech', 'HealthTech'],
    email: 'bradley@tuskventures.com',
    linkedin: 'linkedin.com/in/bradleytusk',
  },
  {
    name: 'Steve Schlafman',
    org: 'High Output',
    bio: 'Coach and angel; ex-RRE/Primary; Brooklyn-based',
    location: { city: 'Brooklyn', state: 'NY' },
    stages: ['Pre-Seed', 'Seed'],
    sectors: ['B2B SaaS', 'Productivity', 'Future of Work'],
    email: 'steve@highoutput.co',
    linkedin: 'linkedin.com/in/schlaf',
  },
  {
    name: 'Dennis Crowley',
    org: 'Independent Angel',
    bio: 'Foursquare cofounder; NYC operator and occasional angel',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed'],
    sectors: ['Consumer', 'Local', 'Sports'],
    email: 'dennis@dcrowley.com',
    linkedin: 'linkedin.com/in/denniscrowley',
  },
  {
    name: 'Scott Belsky',
    org: 'Adobe (CPO)',
    bio: 'Behance founder; Adobe exec; active seed angel',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed', 'Series A'],
    sectors: ['Design Tools', 'Creator Economy', 'SaaS'],
    email: 'scott@behance.com',
    linkedin: 'linkedin.com/in/scottbelsky',
  },
  {
    name: 'Howard Morgan',
    org: 'B Capital',
    bio: 'First Round Capital cofounder; pioneer of seed investing',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed', 'Series A'],
    sectors: ['Enterprise Software', 'Marketplaces'],
    email: 'howard@bcapital.com',
    linkedin: 'linkedin.com/in/howardmorgan',
  },
  {
    name: 'Ed Zimmerman',
    org: 'Lowenstein Sandler',
    bio: 'Longtime NYC venture lawyer and angel',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed', 'Series A'],
    sectors: ['Consumer', 'FinTech', 'SaaS'],
    email: 'ed@lowenstein.com',
    linkedin: 'linkedin.com/in/edzimmerman',
  },
  {
    name: 'Laurel Touby',
    org: 'Supernode Ventures',
    bio: 'Mediabistro founder turned investor',
    location: { city: 'New York', state: 'NY' },
    stages: ['Pre-Seed', 'Seed'],
    sectors: ['Enterprise SaaS', 'FinTech', 'DeepTech'],
    email: 'laurel@supernode.vc',
    linkedin: 'linkedin.com/in/laureltouby',
  },
  {
    name: 'Peter Boyce II',
    org: 'Stellation Capital',
    bio: 'Founder of Stellation Capital; ex-General Catalyst',
    location: { city: 'Brooklyn', state: 'NY' },
    stages: ['Pre-Seed', 'Seed'],
    sectors: ['Consumer', 'SaaS'],
    email: 'peter@stellation.co',
    linkedin: 'linkedin.com/in/peterboyce',
  },
  {
    name: 'Josh Wolfe',
    org: 'Lux Capital',
    bio: 'Co-founder of Lux Capital; deeptech focus; NYC native',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed', 'Series A'],
    sectors: ['DeepTech', 'Defense', 'BioTech', 'AI/ML'],
    email: 'josh@luxcapital.com',
    linkedin: 'linkedin.com/in/joshwolfe',
  },
  {
    name: 'Alexa von Tobel',
    org: 'Inspired Capital',
    bio: 'LearnVest founder; NYC fintech operator-turned-investor',
    location: { city: 'New York', state: 'NY' },
    stages: ['Pre-Seed', 'Series A'],
    sectors: ['FinTech', 'Consumer', 'SaaS'],
    email: 'alexa@inspired.com',
    linkedin: 'linkedin.com/in/alexavontobel',
  },
  {
    name: 'Charlie O\'Donnell',
    org: 'Brooklyn Bridge Ventures',
    bio: 'Founder of Brooklyn Bridge Ventures; invests pre-seed/seed in NYC founders',
    location: { city: 'Brooklyn', state: 'NY' },
    stages: ['Pre-Seed', 'Seed'],
    sectors: ['SaaS', 'Marketplaces', 'FinTech'],
    email: 'charlie@brooklynbridge.vc',
    linkedin: 'linkedin.com/in/charlieodonnell',
  },
  {
    name: 'Annie Kadavy',
    org: 'Independent Angel',
    bio: 'Former managing director at Redpoint, active angel in NYC ecosystem',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed', 'Series A'],
    sectors: ['B2B SaaS', 'Future of Work', 'Marketplaces'],
    email: 'annie@kadavy.com',
    linkedin: 'linkedin.com/in/anniekadavy',
  },
  {
    name: 'Basil Moftah',
    org: 'Independent Angel',
    bio: 'NYC-based angel/operator investing in B2B and media',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed', 'Series A'],
    sectors: ['Media', 'B2B SaaS', 'Data'],
    email: 'basil@moftah.com',
    linkedin: 'linkedin.com/in/basilmoftah',
  },
  {
    name: 'Mark Peter Davis',
    org: 'Interplay Ventures',
    bio: 'Managing partner at Interplay; writes about NY startup ecosystem',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed', 'Series A'],
    sectors: ['B2B SaaS', 'Marketplaces', 'FinTech', 'HealthTech'],
    email: 'mark@interplay.vc',
    linkedin: 'linkedin.com/in/markpeterdavis',
  },
  {
    name: 'Jenny Abramson',
    org: 'Rethink Impact',
    bio: 'Leads investments in tech with a gender/equity lens',
    location: { city: 'New York', state: 'NY' },
    stages: ['Seed', 'Series A'],
    sectors: ['Future of Work', 'HealthTech', 'EdTech', 'Impact'],
    email: 'jenny@rethinkimpact.com',
    linkedin: 'linkedin.com/in/jennyabramson',
  },
]

const statuses = ['new', 'contacted', 'interested', 'meeting_scheduled', 'passed']

// Generate check sizes based on stage
function getCheckSize(stagePrefs) {
  if (stagePrefs.includes('Pre-Seed')) return { min: 50000, max: 250000 }
  if (stagePrefs.includes('Seed')) return { min: 250000, max: 1500000 }
  if (stagePrefs.includes('Series A')) return { min: 1000000, max: 5000000 }
  return { min: 500000, max: 3000000 }
}

// Generate fit score based on various factors
function generateFitScore(location, sectors) {
  let score = 50 // base score
  
  // Boost for NY/NJ/CT (tri-state area) - all our investors are tri-state!
  if (['NY', 'NJ', 'CT'].includes(location.state)) score += 20
  
  // Boost for preferred sectors for Westchester Angels
  const preferredSectors = ['FinTech', 'SaaS', 'HealthTech', 'Enterprise Software', 'B2B SaaS']
  if (sectors.some(s => preferredSectors.includes(s))) score += 15
  
  // Add some realistic variance
  score += Math.floor(Math.random() * 20) - 5
  
  // Cap at 100
  return Math.min(100, Math.max(60, score))
}

// Generate realistic portfolio companies based on sector
function generatePortfolio(sectors) {
  const portfolioCount = Math.floor(Math.random() * 8) + 5
  const companies = {
    'FinTech': ['Stripe', 'Coinbase', 'Robinhood', 'Plaid', 'Chime', 'Brex', 'Affirm', 'Checkout.com'],
    'SaaS': ['Slack', 'Zoom', 'Asana', 'Notion', 'Figma', 'Airtable', 'Dropbox', 'Intercom'],
    'B2B SaaS': ['Salesforce', 'HubSpot', 'Zendesk', 'ServiceNow', 'Workday', 'Atlassian'],
    'HealthTech': ['Oscar Health', 'Ro', 'Hims', 'One Medical', 'Devoted Health', 'Cityblock', 'Headway'],
    'Consumer': ['Warby Parker', 'Casper', 'Away', 'Glossier', 'Allbirds', 'Rent the Runway'],
    'Marketplaces': ['Etsy', 'Faire', 'Reverb', 'Poshmark', 'Vinted', 'StockX'],
    'EdTech': ['Coursera', 'Udemy', 'Duolingo', 'Masterclass', 'Guild Education', 'Lambda School'],
    'E-commerce': ['Shopify', 'Instacart', 'DoorDash', 'Faire', 'Squarespace'],
    'Media': ['BuzzFeed', 'Vox', 'Vice', 'Complex', 'Axios', 'The Verge'],
    'AI/ML': ['Hugging Face', 'Scale AI', 'Dataiku', 'Weights & Biases', 'Anthropic'],
  }
  
  const allCompanies = []
  sectors.forEach(sector => {
    if (companies[sector]) {
      allCompanies.push(...companies[sector])
    }
  })
  
  // Fallback to general tech companies if sector-specific not found
  const fallback = ['Etsy', 'Kickstarter', 'Tumblr', 'Foursquare', 'Pinterest', 'MongoDB', 'DigitalOcean']
  const pool = allCompanies.length > 0 ? allCompanies : fallback
  
  return [...new Set(pool)]
    .sort(() => 0.5 - Math.random())
    .slice(0, portfolioCount)
}

// Main function to generate prospects from real investor data
export function generateMockProspects() {
  const prospects = realInvestors.map((investor, index) => {
    const location = { ...investor.location, country: 'US' }
    const checkSize = getCheckSize(investor.stages)
    const fitScore = generateFitScore(location, investor.sectors)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const portfolio = generatePortfolio(investor.sectors)
    
    // Extract first and last name
    const nameParts = investor.name.split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ')
    
    // Generate phone number
    const areaCode = location.state === 'NY' ? ['212', '646', '917'][Math.floor(Math.random() * 3)] : '201'
    const phone = `(${areaCode}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
    
    // Generate website
    const orgSlug = investor.org.toLowerCase().replace(/[^a-z0-9]+/g, '')
    const website = `https://www.${orgSlug}.com`
    
    return {
      id: index + 1,
      name: investor.name,
      firstName,
      lastName,
      org: investor.org,
      location,
      sectors: investor.sectors,
      stagePreferences: investor.stages,
      checkSize,
      fitScore,
      whySummary: investor.bio,
      email: investor.email,
      linkedin: investor.linkedin, // Modal will add https:// protocol
      website,
      phone,
      status,
      portfolio,
      tags: [],
      notes: '',
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastEnrichedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastContactedAt: status !== 'new' ? new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString() : null,
      sourceId: Math.floor(Math.random() * 3) + 1,
    }
    })
  
  // Sort by fit score descending by default
  return prospects.sort((a, b) => b.fitScore - a.fitScore)
}

// Calculate stats from prospects
export function calculateStats(prospects) {
  if (!prospects.length) {
    return {
      totalProspects: 0,
      avgFitScore: 0,
      contacted: 0,
      highFit: 0,
      byStatus: {},
      bySector: {},
      byState: {},
      scoreDistribution: []
    }
  }
  
  const stats = {
    totalProspects: prospects.length,
    avgFitScore: Math.round(prospects.reduce((sum, p) => sum + p.fitScore, 0) / prospects.length),
    contacted: prospects.filter(p => p.status !== 'new').length,
    highFit: prospects.filter(p => p.fitScore >= 80).length,
    byStatus: {},
    bySector: {},
    byState: {},
    scoreDistribution: [
      { range: '90-100', count: 0 },
      { range: '80-89', count: 0 },
      { range: '70-79', count: 0 },
      { range: '60-69', count: 0 },
      { range: '0-59', count: 0 },
    ]
  }
  
  prospects.forEach(prospect => {
    // By status
    stats.byStatus[prospect.status] = (stats.byStatus[prospect.status] || 0) + 1
    
    // By sector
    prospect.sectors.forEach(sector => {
      stats.bySector[sector] = (stats.bySector[sector] || 0) + 1
    })
    
    // By state
    stats.byState[prospect.location.state] = (stats.byState[prospect.location.state] || 0) + 1
    
    // Score distribution
    if (prospect.fitScore >= 90) stats.scoreDistribution[0].count++
    else if (prospect.fitScore >= 80) stats.scoreDistribution[1].count++
    else if (prospect.fitScore >= 70) stats.scoreDistribution[2].count++
    else if (prospect.fitScore >= 60) stats.scoreDistribution[3].count++
    else stats.scoreDistribution[4].count++
  })
  
  return stats
}

// Get unique values for filters
export function getFilterOptions(prospects) {
  const allSectors = new Set()
  const allStates = new Set()
  const allStatuses = new Set()
  
  prospects.forEach(prospect => {
    prospect.sectors.forEach(sector => allSectors.add(sector))
    allStates.add(prospect.location.state)
    allStatuses.add(prospect.status)
  })
  
  return {
    sectors: Array.from(allSectors).sort(),
    states: Array.from(allStates).sort(),
    statuses: Array.from(allStatuses).sort()
  }
}

// Status labels for UI
export const statusLabels = {
  new: 'New',
  contacted: 'Contacted',
  interested: 'Interested',
  meeting_scheduled: 'Meeting Scheduled',
  passed: 'Passed'
}

// Status colors
export const statusColors = {
  new: 'primary',
  contacted: 'info',
  interested: 'success',
  meeting_scheduled: 'warning',
  passed: 'error'
}


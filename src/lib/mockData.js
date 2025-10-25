// Mock data for demo POC - realistic investor profiles

const firstNames = [
  'Sarah', 'Michael', 'Jennifer', 'David', 'Emily', 'Robert', 'Lisa', 'James',
  'Amanda', 'John', 'Rachel', 'William', 'Jessica', 'Daniel', 'Michelle',
  'Christopher', 'Laura', 'Matthew', 'Ashley', 'Andrew', 'Stephanie', 'Kevin',
  'Nicole', 'Brian', 'Elizabeth', 'Thomas', 'Rebecca', 'Ryan', 'Maria', 'Jason'
]

const lastNames = [
  'Chen', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore',
  'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
  'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis',
  'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Lopez'
]

const organizations = [
  'TechVentures Capital', 'Summit Partners', 'Elevation Capital', 'Insight Ventures',
  'Accel Partners', 'FirstMark Capital', 'Union Square Ventures', 'Greycroft Partners',
  'RRE Ventures', 'Lerer Hippeau', 'Primary Venture Partners', 'Work-Bench',
  'Tiger Global', 'General Catalyst', 'Bessemer Venture Partners', 'Matrix Partners',
  'Sequoia Capital', 'Lightspeed Venture', 'Andreessen Horowitz', 'Kleiner Perkins',
  'Battery Ventures', 'Spark Capital', 'Foundry Group', 'True Ventures',
  'CrossLink Capital', 'Upfront Ventures', 'Mayfield Fund', 'NEA',
  'Index Ventures', 'Greylock Partners', 'Benchmark Capital', 'New Enterprise Associates',
  'Bain Capital Ventures', 'CRV', 'Canaan Partners', 'Highland Capital',
  'Polaris Partners', 'Atlas Venture', 'Trinity Ventures', 'Menlo Ventures'
]

// Tri-State Area only (NY, NJ, CT)
const cities = {
  'NY': ['New York', 'Brooklyn', 'White Plains', 'Yonkers', 'New Rochelle', 'Scarsdale', 'Manhattan', 'Queens', 'Westchester', 'Long Island'],
  'NJ': ['Jersey City', 'Hoboken', 'Princeton', 'Newark', 'Montclair', 'Fort Lee', 'Morristown', 'Paramus'],
  'CT': ['Stamford', 'Greenwich', 'New Haven', 'Hartford', 'Westport', 'Norwalk', 'Danbury', 'Bridgeport']
}

const sectors = [
  'FinTech', 'SaaS', 'HealthTech', 'EdTech', 'E-commerce', 
  'Enterprise Software', 'Consumer', 'Cybersecurity', 'AI/ML',
  'IoT', 'CleanTech', 'FoodTech', 'PropTech', 'LegalTech'
]

const stages = ['Pre-Seed', 'Seed', 'Series A', 'Series B']

const statuses = ['new', 'contacted', 'interested', 'meeting_scheduled', 'passed']

const whyTemplates = [
  (name, org, sectors, location) => 
    `${name} at ${org} has strong focus on ${sectors[0]} with recent investments in the ${location.state} area. Geographic proximity and investment thesis align perfectly with your portfolio.`,
  (name, org, sectors) => 
    `Excellent fit based on ${org}'s portfolio concentration in ${sectors.join(' and ')}. ${name} actively seeks early-stage opportunities and has a track record of hands-on mentorship.`,
  (name, org, sectors) => 
    `${org} recently closed a new fund focused on ${sectors[0]} investments. ${name} is known for quick decision-making and bringing strategic value beyond capital.`,
  (name, org, location) => 
    `${name} has been actively investing in the ${location.state} startup ecosystem. ${org} offers strong network connections and operational expertise.`,
  (name, org, sectors) => 
    `Perfect stage alignment with ${org}'s sweet spot. ${name} has made ${Math.floor(Math.random() * 15 + 5)} investments in ${sectors[0]} over the past 3 years.`,
]

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
  
  // Boost for NY/NJ/CT (tri-state area)
  if (['NY', 'NJ', 'CT'].includes(location.state)) score += 20
  
  // Boost for preferred sectors
  const preferredSectors = ['FinTech', 'SaaS', 'HealthTech', 'Enterprise Software']
  if (sectors.some(s => preferredSectors.includes(s))) score += 15
  
  // Add some randomness
  score += Math.floor(Math.random() * 20) - 5
  
  // Cap at 100
  return Math.min(100, Math.max(30, score))
}

// Generate portfolio companies
function generatePortfolio(sectors) {
  const portfolioCount = Math.floor(Math.random() * 8) + 3
  const companies = [
    'Stripe', 'Coinbase', 'Robinhood', 'Plaid', 'Chime', 'Brex', 'Affirm',
    'Slack', 'Zoom', 'Asana', 'Notion', 'Figma', 'Airtable', 'Dropbox',
    'Oscar Health', 'Ro', 'Hims', 'One Medical', 'Devoted Health', 'Cityblock',
    'Coursera', 'Udemy', 'Duolingo', 'Masterclass', 'Guild Education',
    'Shopify', 'Instacart', 'DoorDash', 'Faire', 'Warby Parker'
  ]
  
  return companies
    .sort(() => 0.5 - Math.random())
    .slice(0, portfolioCount)
}

// Main function to generate mock prospects
export function generateMockProspects(count = 75) {
  const prospects = []
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const org = organizations[Math.floor(Math.random() * organizations.length)]
    const state = Object.keys(cities)[Math.floor(Math.random() * Object.keys(cities).length)]
    const cityList = cities[state]
    const city = cityList[Math.floor(Math.random() * cityList.length)]
    
    // Generate 1-3 sectors
    const numSectors = Math.floor(Math.random() * 3) + 1
    const investorSectors = []
    for (let j = 0; j < numSectors; j++) {
      const sector = sectors[Math.floor(Math.random() * sectors.length)]
      if (!investorSectors.includes(sector)) {
        investorSectors.push(sector)
      }
    }
    
    // Generate 1-2 stage preferences
    const numStages = Math.floor(Math.random() * 2) + 1
    const stagePreferences = []
    for (let j = 0; j < numStages; j++) {
      const stage = stages[Math.floor(Math.random() * stages.length)]
      if (!stagePreferences.includes(stage)) {
        stagePreferences.push(stage)
      }
    }
    
    const location = { city, state, country: 'US' }
    const checkSize = getCheckSize(stagePreferences)
    const fitScore = generateFitScore(location, investorSectors)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const template = whyTemplates[Math.floor(Math.random() * whyTemplates.length)]
    const portfolio = generatePortfolio(investorSectors)
    
    prospects.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      org,
      location,
      sectors: investorSectors,
      stagePreferences,
      checkSize,
      fitScore,
      whySummary: template(firstName, org, investorSectors, location),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${org.toLowerCase().replace(/\s+/g, '')}.com`,
      linkedin: `linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      website: `https://www.${org.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      status,
      portfolio,
      tags: [],
      notes: '',
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastEnrichedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastContactedAt: status !== 'new' ? new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString() : null,
      sourceId: Math.floor(Math.random() * 5) + 1,
    })
  }
  
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


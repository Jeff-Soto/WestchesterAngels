/**
 * @fileoverview AI-powered data enrichment and analysis functions
 * Uses OpenAI to enhance prospect data with intelligent insights
 */

import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Generate AI-powered match explanations
 * @param {Object} prospect - Prospect data
 * @returns {Promise<string>} Detailed match explanation
 */
export async function generateAIMatchExplanation(prospect) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  try {
    const sectors = prospect.sectors?.join(', ') || 'various sectors'
    const location = prospect.location 
      ? `${prospect.location.city}, ${prospect.location.state}`
      : 'unknown location'
    const portfolio = prospect.portfolio?.slice(0, 5).join(', ') || 'no portfolio data'
    const stages = prospect.stagePreferences?.join(', ') || 'unknown stages'
    const investorType = prospect.investorType || 'unknown type'
    const bio = prospect.bio || 'no bio available'

    const prompt = `Analyze this investor prospect and explain why they are a good match for Westchester Angels, an early-stage angel investment group focused on tech companies in the NY/CT/NJ tri-state region.

Investor Profile:
- Name: ${prospect.name || 'Unknown'}
- Organization: ${prospect.org || 'Unknown'}
- Location: ${location}
- Investor Type: ${investorType}
- Focus Sectors: ${sectors}
- Stage Preferences: ${stages}
- Portfolio Companies: ${portfolio}
${bio !== 'no bio available' ? `- Background: ${bio}` : ''}

Westchester Angels Focus:
- Geographic: NY, NJ, CT, PA (within 60 miles of NYC)
- Stage: Early-stage (idea, prototype, early revenue)
- Sectors: Tech companies, SaaS, FinTech, Healthcare, AI/ML, Consumer
- Investor Types: Solo angels, angel networks, early-stage VCs

Generate a detailed, personalized explanation (2-3 sentences) that:
1. References specific portfolio companies if relevant
2. Highlights geographic fit
3. Explains sector alignment
4. Notes stage preferences
5. Mentions any unique strengths or connections

Be specific and reference actual data from the profile. Return only the explanation text, no JSON or formatting.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing investor profiles and explaining why they match specific investment groups. Be specific, concise, and reference actual data.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    })

    return completion.choices[0]?.message?.content?.trim() || 'AI analysis unavailable'
  } catch (error) {
    console.error('Error generating AI match explanation:', error)
    throw error
  }
}

/**
 * AI-powered relevance scoring
 * @param {Object} prospect - Prospect data
 * @param {number} ruleBasedScore - Existing rule-based score (0-100)
 * @returns {Promise<{score: number, reasoning: string, confidence: number}>}
 */
export async function generateAIScore(prospect, ruleBasedScore) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  try {
    const sectors = prospect.sectors?.join(', ') || 'various sectors'
    const location = prospect.location 
      ? `${prospect.location.city}, ${prospect.location.state}`
      : 'unknown location'
    const portfolio = prospect.portfolio?.slice(0, 5).join(', ') || 'no portfolio data'
    const stages = prospect.stagePreferences?.join(', ') || 'unknown stages'
    const investorType = prospect.investorType || 'unknown type'
    const bio = prospect.bio || 'no bio available'

    const prompt = `Analyze this investor prospect and provide a relevance score (0-100) for Westchester Angels.

Investor Profile:
- Name: ${prospect.name || 'Unknown'}
- Organization: ${prospect.org || 'Unknown'}
- Location: ${location}
- Investor Type: ${investorType}
- Focus Sectors: ${sectors}
- Stage Preferences: ${stages}
- Portfolio Companies: ${portfolio}
${bio !== 'no bio available' ? `- Background: ${bio}` : ''}
- Current Rule-Based Score: ${ruleBasedScore}/100

Westchester Angels Criteria:
- Geographic: NY, NJ, CT, PA (within 60 miles of NYC) - HIGH PRIORITY
- Stage: Early-stage (idea, prototype, early revenue) - HIGH PRIORITY
- Sectors: Tech companies, SaaS, FinTech, Healthcare, AI/ML, Consumer
- Investor Types: Solo angels, angel networks, early-stage VCs
- Contactability: Email/phone available

Provide:
1. A refined score (0-100) that considers context and nuance beyond rules
2. Brief reasoning (1-2 sentences)
3. Confidence level (0-1) in your assessment

Return JSON:
{
  "score": 85,
  "reasoning": "Strong geographic fit in White Plains, NY with early-stage focus and relevant portfolio companies.",
  "confidence": 0.9
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at scoring investor prospects. Consider context, nuance, and subtle signals that rule-based systems miss.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 200,
      response_format: { type: 'json_object' }
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    const result = JSON.parse(responseText)
    
    // Blend AI score with rule-based score (70% AI, 30% rule-based for balance)
    const blendedScore = Math.round(
      (result.score * 0.7) + (ruleBasedScore * 0.3)
    )

    return {
      score: Math.min(100, Math.max(0, blendedScore)),
      reasoning: result.reasoning || 'AI analysis completed',
      confidence: result.confidence || 0.8
    }
  } catch (error) {
    console.error('Error generating AI score:', error)
    // Fallback to rule-based score
    return {
      score: ruleBasedScore,
      reasoning: 'Using rule-based scoring (AI unavailable)',
      confidence: 0.5
    }
  }
}

/**
 * Smart data enrichment - fill missing fields using AI
 * @param {Object} prospect - Prospect with potentially missing fields
 * @returns {Promise<Object>} Enriched prospect
 */
export async function enrichProspectData(prospect) {
  if (!process.env.OPENAI_API_KEY) {
    return prospect // Return unchanged if no API key
  }

  try {
    const existingData = {
      name: prospect.name || '',
      org: prospect.org || '',
      bio: prospect.bio || '',
      portfolio: prospect.portfolio?.join(', ') || '',
      sectors: prospect.sectors?.join(', ') || '',
      location: prospect.location 
        ? `${prospect.location.city}, ${prospect.location.state}`
        : ''
    }

    const prompt = `Analyze this investor prospect data and infer missing information.

Existing Data:
${JSON.stringify(existingData, null, 2)}

Infer and return JSON with:
1. "thesis" - Investment thesis/philosophy (if can be inferred from bio/portfolio)
2. "stagePreferences" - Array of likely stage preferences (idea, prototype, early_revenue, scaling) if missing
3. "sectors" - Array of refined sector focus if missing or incomplete
4. "checkSizeRange" - Estimated check size range if missing (e.g., {"min": 25000, "max": 250000})
5. "summary" - 2-3 sentence summary of the investor

Only include fields you can reasonably infer. Return JSON:
{
  "thesis": "...",
  "stagePreferences": ["idea", "prototype"],
  "sectors": ["SaaS", "FinTech"],
  "checkSizeRange": {"min": 50000, "max": 200000},
  "summary": "..."
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing investor data and inferring missing information from available context.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 400,
      response_format: { type: 'json_object' }
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      return prospect
    }

    const enriched = JSON.parse(responseText)
    
    // Merge enriched data with existing prospect
    return {
      ...prospect,
      thesis: enriched.thesis || prospect.thesis,
      stagePreferences: enriched.stagePreferences || prospect.stagePreferences,
      sectors: enriched.sectors || prospect.sectors,
      minCheckUsd: enriched.checkSizeRange?.min || prospect.minCheckUsd,
      maxCheckUsd: enriched.checkSizeRange?.max || prospect.maxCheckUsd,
      aiSummary: enriched.summary || prospect.aiSummary
    }
  } catch (error) {
    console.error('Error enriching prospect data:', error)
    return prospect // Return unchanged on error
  }
}

/**
 * Extract investment thesis from prospect data
 * @param {Object} prospect - Prospect data
 * @returns {Promise<string>} Investment thesis
 */
export async function extractInvestmentThesis(prospect) {
  if (!process.env.OPENAI_API_KEY) {
    return null
  }

  try {
    const bio = prospect.bio || ''
    const portfolio = prospect.portfolio?.join(', ') || ''
    const sectors = prospect.sectors?.join(', ') || ''
    const stages = prospect.stagePreferences?.join(', ') || ''

    const prompt = `Extract and summarize the investment thesis/philosophy for this investor:

Name: ${prospect.name || 'Unknown'}
Organization: ${prospect.org || 'Unknown'}
Bio: ${bio || 'No bio available'}
Portfolio Companies: ${portfolio || 'No portfolio data'}
Focus Sectors: ${sectors || 'Unknown'}
Stage Preferences: ${stages || 'Unknown'}

Generate a concise investment thesis (2-3 sentences) that captures:
- Their investment philosophy
- What types of companies they look for
- Their approach to investing

If insufficient data, return "Insufficient data to determine investment thesis."

Return only the thesis text, no JSON or formatting.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at extracting investment theses from investor profiles.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 200
    })

    const thesis = completion.choices[0]?.message?.content?.trim()
    return thesis && !thesis.includes('Insufficient data') ? thesis : null
  } catch (error) {
    console.error('Error extracting investment thesis:', error)
    return null
  }
}

/**
 * Analyze portfolio patterns
 * @param {Object} prospect - Prospect with portfolio data
 * @returns {Promise<Object>} Portfolio analysis
 */
export async function analyzePortfolioPatterns(prospect) {
  if (!process.env.OPENAI_API_KEY || !prospect.portfolio || prospect.portfolio.length === 0) {
    return null
  }

  try {
    const portfolio = prospect.portfolio.join(', ')
    const sectors = prospect.sectors?.join(', ') || 'various sectors'

    const prompt = `Analyze this investor's portfolio companies and identify patterns:

Portfolio Companies: ${portfolio}
Stated Sectors: ${sectors}

Return JSON with:
1. "commonCharacteristics" - Array of common traits across portfolio (e.g., ["B2B SaaS", "NYC-based", "Seed stage"])
2. "sectorFocus" - Primary sector focus based on actual investments
3. "geographicPattern" - Geographic pattern if evident
4. "stagePattern" - Stage pattern if evident
5. "insights" - 2-3 sentence summary of investment patterns

{
  "commonCharacteristics": ["..."],
  "sectorFocus": "...",
  "geographicPattern": "...",
  "stagePattern": "...",
  "insights": "..."
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing investment portfolios and identifying patterns.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 300,
      response_format: { type: 'json_object' }
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      return null
    }

    return JSON.parse(responseText)
  } catch (error) {
    console.error('Error analyzing portfolio patterns:', error)
    return null
  }
}

/**
 * Semantic search - understand search intent
 * @param {string} query - Search query
 * @param {Array<Object>} prospects - All prospects
 * @returns {Promise<Array<Object>>} Relevant prospects with relevance scores
 */
export async function semanticSearch(query, prospects) {
  if (!process.env.OPENAI_API_KEY || !query || query.trim().length === 0) {
    return prospects.map(p => ({ prospect: p, relevance: 1 }))
  }

  try {
    // For semantic search, we'll use embeddings or a simpler approach
    // For now, use AI to understand the query intent and match against prospects
    
    const queryAnalysis = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Analyze search queries and extract key search criteria.'
        },
        {
          role: 'user',
          content: `Analyze this search query: "${query}"

Extract:
1. What sectors are they looking for?
2. What locations?
3. What investor types?
4. Any other criteria?

Return JSON:
{
  "sectors": ["..."],
  "locations": ["..."],
  "investorTypes": ["..."],
  "otherCriteria": "..."
}`
        }
      ],
      temperature: 0.3,
      max_tokens: 150,
      response_format: { type: 'json_object' }
    })

    const analysis = JSON.parse(queryAnalysis.choices[0]?.message?.content)
    
    // Score prospects based on semantic match
    const scored = prospects.map(prospect => {
      let score = 0
      
      // Sector match
      if (analysis.sectors && analysis.sectors.length > 0) {
        const sectorMatch = analysis.sectors.some(sector => 
          prospect.sectors?.some(p => p.toLowerCase().includes(sector.toLowerCase()))
        )
        if (sectorMatch) score += 3
      }
      
      // Location match
      if (analysis.locations && analysis.locations.length > 0) {
        const locationMatch = analysis.locations.some(loc => 
          prospect.location?.state?.toLowerCase().includes(loc.toLowerCase()) ||
          prospect.location?.city?.toLowerCase().includes(loc.toLowerCase())
        )
        if (locationMatch) score += 2
      }
      
      // Investor type match
      if (analysis.investorTypes && analysis.investorTypes.length > 0) {
        const typeMatch = analysis.investorTypes.some(type => 
          prospect.investorType?.toLowerCase().includes(type.toLowerCase())
        )
        if (typeMatch) score += 2
      }
      
      // Name match (fallback to keyword search)
      const nameMatch = prospect.name?.toLowerCase().includes(query.toLowerCase())
      if (nameMatch) score += 5
      
      return { prospect, relevance: score }
    })
    
    // Sort by relevance and return
    return scored
      .filter(item => item.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
  } catch (error) {
    console.error('Error in semantic search:', error)
    // Fallback to simple keyword search
    return prospects
      .filter(p => 
        p.name?.toLowerCase().includes(query.toLowerCase())
      )
      .map(p => ({ prospect: p, relevance: 1 }))
  }
}

/**
 * Detect duplicate prospects
 * @param {Object} prospect1 - First prospect
 * @param {Object} prospect2 - Second prospect
 * @returns {Promise<{isDuplicate: boolean, confidence: number, reasoning: string}>}
 */
export async function detectDuplicate(prospect1, prospect2) {
  if (!process.env.OPENAI_API_KEY) {
    // Fallback to simple name matching
    const nameMatch = prospect1.name?.toLowerCase() === prospect2.name?.toLowerCase()
    return {
      isDuplicate: nameMatch,
      confidence: nameMatch ? 0.7 : 0.3,
      reasoning: nameMatch ? 'Names match exactly' : 'Names do not match'
    }
  }

  try {
    const prompt = `Determine if these two investor prospects are the same person:

Prospect 1:
- Name: ${prospect1.name || 'Unknown'}
- Organization: ${prospect1.org || 'Unknown'}
- Email: ${prospect1.email || 'Unknown'}
- Location: ${prospect1.location?.city || ''}, ${prospect1.location?.state || ''}
- LinkedIn: ${prospect1.linkedin || 'Unknown'}

Prospect 2:
- Name: ${prospect2.name || 'Unknown'}
- Organization: ${prospect2.org || 'Unknown'}
- Email: ${prospect2.email || 'Unknown'}
- Location: ${prospect2.location?.city || ''}, ${prospect2.location?.state || ''}
- LinkedIn: ${prospect2.linkedin || 'Unknown'}

Return JSON:
{
  "isDuplicate": true/false,
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at identifying duplicate records. Consider name variations, organization matches, and contact information.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 150,
      response_format: { type: 'json_object' }
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    return JSON.parse(responseText)
  } catch (error) {
    console.error('Error detecting duplicate:', error)
    return {
      isDuplicate: false,
      confidence: 0.3,
      reasoning: 'Error in duplicate detection'
    }
  }
}

/**
 * Research prospect and generate notes
 * @param {Object} prospect - Prospect data
 * @returns {Promise<string>} Research notes
 */
export async function researchProspect(prospect) {
  if (!process.env.OPENAI_API_KEY) {
    return null
  }

  try {
    const prompt = `Based on this investor profile, generate research notes that would be useful for outreach:

Name: ${prospect.name || 'Unknown'}
Organization: ${prospect.org || 'Unknown'}
Location: ${prospect.location?.city || ''}, ${prospect.location?.state || ''}
Sectors: ${prospect.sectors?.join(', ') || 'Unknown'}
Portfolio: ${prospect.portfolio?.slice(0, 5).join(', ') || 'No portfolio data'}
Bio: ${prospect.bio || 'No bio available'}

Generate research notes (3-4 bullet points) covering:
- Recent investment activity (if inferable)
- Notable portfolio companies
- Sector focus and trends
- Geographic patterns
- Any other relevant insights

Return as a bulleted list, no JSON.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a research analyst specializing in investor profiles. Generate actionable research notes.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    })

    return completion.choices[0]?.message?.content?.trim() || null
  } catch (error) {
    console.error('Error researching prospect:', error)
    return null
  }
}


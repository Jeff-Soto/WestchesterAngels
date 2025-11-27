import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Generate a personalized outreach email for an investor
 * @param {Object} investor - Investor prospect data
 * @returns {Promise<{subject: string, body: string, personalizedReasons: string}>}
 */
export async function generateInvestorEmail(investor) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  try {
    // Build context about the investor
    const sectors = investor.sectors?.join(', ') || 'various sectors'
    const location = investor.location 
      ? `${investor.location.city}, ${investor.location.state}`
      : 'their location'
    const portfolio = investor.portfolio?.length > 0
      ? investor.portfolio.slice(0, 3).join(', ')
      : 'their portfolio'
    const stagePreferences = investor.stagePreferences?.join(', ') || 'early-stage companies'
    const org = investor.org || 'their organization'
    const name = investor.name || 'there'

    // Create the prompt
    const prompt = `You are writing a professional, personalized outreach email for Westchester Angels, an early-stage angel investment group focused on tech companies in the NY/CT/NJ tri-state region.

Investor Details:
- Name: ${name}
- Organization: ${org}
- Location: ${location}
- Focus Sectors: ${sectors}
- Stage Preferences: ${stagePreferences}
${portfolio !== 'their portfolio' ? `- Notable Portfolio Companies: ${portfolio}` : ''}
${investor.bio ? `- Background: ${investor.bio}` : ''}

Requirements:
1. Write a professional, concise email (3-4 short paragraphs max)
2. Personalize it by referencing their specific sectors, location, or portfolio companies
3. Explain why Westchester Angels would be a good fit for them
4. Keep the tone professional but friendly
5. Include a clear call-to-action (suggest a brief call or meeting)
6. Do NOT include placeholders like [Name] or [Company] - use the actual information provided

Generate:
1. A compelling subject line (max 60 characters)
2. The email body
3. A brief explanation of why this email is personalized for them

Return your response as JSON with this exact structure:
{
  "subject": "Subject line here",
  "body": "Email body here with proper line breaks",
  "personalizedReasons": "Brief explanation of personalization"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using mini for cost efficiency, can upgrade to gpt-4 if needed
      messages: [
        {
          role: 'system',
          content: 'You are a professional email writer specializing in investor outreach. You create personalized, compelling emails that build genuine connections.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: 'json_object' }
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    // Parse JSON response
    const emailData = JSON.parse(responseText)

    // Validate response structure
    if (!emailData.subject || !emailData.body) {
      throw new Error('Invalid response format from OpenAI')
    }

    return {
      subject: emailData.subject.trim(),
      body: emailData.body.trim(),
      personalizedReasons: emailData.personalizedReasons || 'Email personalized based on investor profile'
    }
  } catch (error) {
    console.error('Error generating email with OpenAI:', error)
    
    // Provide fallback email if OpenAI fails
    if (error.message.includes('API key') || error.message.includes('OPENAI_API_KEY')) {
      throw new Error('OpenAI API key is not configured. Please check your environment variables.')
    }
    
    throw new Error(`Failed to generate email: ${error.message}`)
  }
}

/**
 * Generate a personalized LinkedIn message for an investor
 * @param {Object} investor - Investor prospect data
 * @returns {Promise<{message: string, personalizedReasons: string}>}
 */
export async function generateLinkedInMessage(investor) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  try {
    // Build context about the investor
    const sectors = investor.sectors?.join(', ') || 'various sectors'
    const location = investor.location 
      ? `${investor.location.city}, ${investor.location.state}`
      : 'their location'
    const portfolio = investor.portfolio?.length > 0
      ? investor.portfolio.slice(0, 3).join(', ')
      : 'their portfolio'
    const stagePreferences = investor.stagePreferences?.join(', ') || 'early-stage companies'
    const org = investor.org || 'their organization'
    const name = investor.name || 'there'

    // Create the prompt
    const prompt = `You are writing a professional, personalized LinkedIn connection message for Westchester Angels, an early-stage angel investment group focused on tech companies in the NY/CT/NJ tri-state region.

Investor Details:
- Name: ${name}
- Organization: ${org}
- Location: ${location}
- Focus Sectors: ${sectors}
- Stage Preferences: ${stagePreferences}
${portfolio !== 'their portfolio' ? `- Notable Portfolio Companies: ${portfolio}` : ''}
${investor.bio ? `- Background: ${investor.bio}` : ''}

Requirements:
1. Write a professional, concise LinkedIn message (2-3 short paragraphs max, ~200-300 words)
2. LinkedIn messages should be more casual and conversational than emails, but still professional
3. Personalize it by referencing their specific sectors, location, or portfolio companies
4. Explain why Westchester Angels would be a good fit for them
5. Keep the tone friendly and approachable, suitable for LinkedIn's platform
6. Include a clear call-to-action (suggest connecting or a brief conversation)
7. Do NOT include placeholders like [Name] or [Company] - use the actual information provided
8. Start with a brief greeting and connection request context

Generate:
1. The LinkedIn message body (ready to copy/paste)
2. A brief explanation of why this message is personalized for them

Return your response as JSON with this exact structure:
{
  "message": "LinkedIn message here with proper line breaks",
  "personalizedReasons": "Brief explanation of personalization"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using mini for cost efficiency, can upgrade to gpt-4 if needed
      messages: [
        {
          role: 'system',
          content: 'You are a professional LinkedIn message writer specializing in investor outreach. You create personalized, compelling messages that build genuine connections on LinkedIn.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 600,
      response_format: { type: 'json_object' }
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    // Parse JSON response
    const messageData = JSON.parse(responseText)

    // Validate response structure
    if (!messageData.message) {
      throw new Error('Invalid response format from OpenAI')
    }

    return {
      message: messageData.message.trim(),
      personalizedReasons: messageData.personalizedReasons || 'Message personalized based on investor profile'
    }
  } catch (error) {
    console.error('Error generating LinkedIn message with OpenAI:', error)
    
    // Provide fallback message if OpenAI fails
    if (error.message.includes('API key') || error.message.includes('OPENAI_API_KEY')) {
      throw new Error('OpenAI API key is not configured. Please check your environment variables.')
    }
    
    throw new Error(`Failed to generate LinkedIn message: ${error.message}`)
  }
}


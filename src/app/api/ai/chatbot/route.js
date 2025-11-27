import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_CONTEXT = `You are a helpful AI assistant for the Westchester Angels Investor Prospecting Engine. Your role is to help users understand and use the system effectively.

SYSTEM CAPABILITIES:
1. **CSV Import**: Users can upload CSV files (AngelMatch, OpenVC, or custom formats) to import investor prospects
2. **AI Features**:
   - AI-powered match explanations (click "🤖 AI Analysis" in prospect modal)
   - Automated research notes generation
   - Portfolio pattern analysis
   - Investment thesis extraction
   - Smart data enrichment during CSV import
   - Semantic search (understand natural language queries)
3. **Filtering**: Users can filter by:
   - Search (name, organization, email, or semantic search)
   - Fit Score (0-100 relevance score)
   - Status (New, Contacted, Interested, Meeting Scheduled, Passed)
   - Sectors
   - State
   - City (filtered by selected states)
4. **Prospect Management**:
   - View detailed prospect information
   - Update prospect status
   - Generate personalized outreach emails
   - Export prospects to CSV
5. **Relevance Scoring**: The system uses a 0-100 scale to score prospects based on:
   - Geographic proximity (NY, NJ, CT, PA within 60 miles of NYC)
   - Investor type (solo angels, angel networks, early-stage VCs)
   - Stage preferences (early-stage focus)
   - Contactability (email/phone available)
   - Portfolio companies

GUIDELINES:
- Be concise and helpful
- Provide step-by-step instructions when needed
- Explain AI features clearly
- Help users understand the relevance scoring system
- Guide users through common workflows
- If asked about something not in the system, politely say you don't have that information
- Always be friendly and professional`

export async function POST(request) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [] } = body

    if (!message || !message.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Message is required' 
        },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI API key is not configured' 
        },
        { status: 500 }
      )
    }

    // Build conversation messages
    const messages = [
      {
        role: 'system',
        content: SYSTEM_CONTEXT
      },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    })

    const responseText = completion.choices[0]?.message?.content

    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    return NextResponse.json({
      success: true,
      data: {
        response: responseText.trim()
      }
    })
  } catch (error) {
    console.error('Error in chatbot:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get chatbot response',
        message: error.message 
      },
      { status: 500 }
    )
  }
}


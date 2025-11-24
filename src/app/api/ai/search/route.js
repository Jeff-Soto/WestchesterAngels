import { NextResponse } from 'next/server'
import { semanticSearch } from '@/lib/ai/enrichment'
import { connectToDatabase } from '@/lib/mongodb'
import { transformProspectForDashboard } from '@/lib/utils/transformProspect'

export async function POST(request) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Search query is required' 
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

    // Fetch all prospects from MongoDB
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'MongoDB not configured' 
        },
        { status: 500 }
      )
    }

    const db = await connectToDatabase()
    const collection = db.collection('prospects')
    
    const dbProspects = await collection.find({}).toArray()

    // Transform to dashboard format
    const prospects = dbProspects.map(p => transformProspectForDashboard(p))

    // Perform semantic search
    const results = await semanticSearch(query, prospects)

    return NextResponse.json({
      success: true,
      data: {
        query,
        results: results.map(r => ({
          prospect: r.prospect,
          relevance: r.relevance
        })),
        count: results.length
      }
    })
  } catch (error) {
    console.error('Error performing semantic search:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to perform search',
        message: error.message 
      },
      { status: 500 }
    )
  }
}


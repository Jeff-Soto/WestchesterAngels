import { NextResponse } from 'next/server'
import { generateAIMatchExplanation } from '@/lib/ai/enrichment'
import { connectToDatabase } from '@/lib/mongodb'
import { transformProspectForDashboard } from '@/lib/utils/transformProspect'

export async function POST(request) {
  try {
    const body = await request.json()
    const { prospectId } = body

    if (!prospectId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'prospectId is required' 
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

    // Fetch prospect from MongoDB
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
    
    const dbProspect = await collection.findOne({ 
      $or: [
        { id: prospectId },
        { id: String(prospectId) },
        { _id: prospectId }
      ]
    })

    if (!dbProspect) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Prospect not found' 
        },
        { status: 404 }
      )
    }

    // Transform to dashboard format
    const prospect = transformProspectForDashboard(dbProspect)

    // Generate AI match explanation
    const explanation = await generateAIMatchExplanation(prospect)

    return NextResponse.json({
      success: true,
      data: {
        prospectId: prospect.id,
        explanation
      }
    })
  } catch (error) {
    console.error('Error generating AI match explanation:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate match explanation',
        message: error.message 
      },
      { status: 500 }
    )
  }
}


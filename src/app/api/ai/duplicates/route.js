import { NextResponse } from 'next/server'
import { detectDuplicate } from '@/lib/ai/enrichment'
import { connectToDatabase } from '@/lib/mongodb'
import { transformProspectForDashboard } from '@/lib/utils/transformProspect'

export async function POST(request) {
  try {
    const body = await request.json()
    const { prospectId1, prospectId2 } = body

    if (!prospectId1 || !prospectId2) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Both prospectId1 and prospectId2 are required' 
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

    // Fetch prospects from MongoDB
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
    
    const dbProspect1 = await collection.findOne({ 
      $or: [
        { id: prospectId1 },
        { id: String(prospectId1) },
        { _id: prospectId1 }
      ]
    })

    const dbProspect2 = await collection.findOne({ 
      $or: [
        { id: prospectId2 },
        { id: String(prospectId2) },
        { _id: prospectId2 }
      ]
    })

    if (!dbProspect1 || !dbProspect2) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'One or both prospects not found' 
        },
        { status: 404 }
      )
    }

    // Transform to dashboard format
    const prospect1 = transformProspectForDashboard(dbProspect1)
    const prospect2 = transformProspectForDashboard(dbProspect2)

    // Detect duplicates
    const duplicateCheck = await detectDuplicate(prospect1, prospect2)

    return NextResponse.json({
      success: true,
      data: {
        prospect1: { id: prospect1.id, name: prospect1.name },
        prospect2: { id: prospect2.id, name: prospect2.name },
        isDuplicate: duplicateCheck.isDuplicate,
        confidence: duplicateCheck.confidence,
        reasoning: duplicateCheck.reasoning
      }
    })
  } catch (error) {
    console.error('Error detecting duplicates:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to detect duplicates',
        message: error.message 
      },
      { status: 500 }
    )
  }
}


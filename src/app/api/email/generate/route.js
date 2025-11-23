import { NextResponse } from 'next/server'
import { generateInvestorEmail } from '@/lib/openai'
import { generateMockProspects } from '@/lib/mockData'

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

    // Get all prospects and find the one by ID
    const prospects = generateMockProspects()
    const prospect = prospects.find(p => p.id === parseInt(prospectId, 10))

    if (!prospect) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Prospect not found' 
        },
        { status: 404 }
      )
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI API key is not configured' 
        },
        { status: 500 }
      )
    }

    // Generate email using OpenAI
    const emailData = await generateInvestorEmail(prospect)

    return NextResponse.json({
      success: true,
      data: {
        prospectId: prospect.id,
        prospectName: prospect.name,
        prospectOrg: prospect.org,
        ...emailData
      }
    })
  } catch (error) {
    console.error('Error generating email:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate email',
        message: error.message 
      },
      { status: 500 }
    )
  }
}


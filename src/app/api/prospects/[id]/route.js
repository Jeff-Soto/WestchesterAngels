import { NextResponse } from 'next/server'
import { generateMockProspects } from '@/lib/mockData'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const prospects = generateMockProspects()
    
    // Find prospect by ID
    const prospect = prospects.find(p => p.id === parseInt(id, 10))
    
    if (!prospect) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Prospect not found' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: prospect
    })
  } catch (error) {
    console.error('Error fetching prospect:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch prospect',
        message: error.message 
      },
      { status: 500 }
    )
  }
}


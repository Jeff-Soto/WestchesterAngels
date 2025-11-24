import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { transformProspectsForDashboard } from '@/lib/utils/transformProspect'

export async function GET(request) {
  try {
    let prospects = []
    
    // Fetch from MongoDB - database is the only source of truth
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: 'MongoDB not configured'
      })
    }
    
    try {
      const db = await connectToDatabase()
      const collection = db.collection('prospects')
      
      // Fetch all prospects from database
      const dbProspects = await collection.find({}).toArray()
      
      // Transform MongoDB documents to dashboard format
      prospects = transformProspectsForDashboard(dbProspects)
      console.log(`Fetched ${prospects.length} prospects from MongoDB`)
      if (prospects.length > 0) {
        console.log('Sample transformed prospect:', JSON.stringify(prospects[0], null, 2))
      }
    } catch (dbError) {
      console.error('Error fetching from database:', dbError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch prospects from database',
          message: dbError.message 
        },
        { status: 500 }
      )
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const sector = searchParams.get('sector')
    const state = searchParams.get('state')
    const status = searchParams.get('status')
    const minScore = searchParams.get('minScore')
    const maxScore = searchParams.get('maxScore')
    const search = searchParams.get('search')
    
    // Apply filters
    if (sector) {
      const sectors = sector.split(',').map(s => s.trim())
      prospects = prospects.filter(p => 
        p.sectors.some(s => sectors.includes(s))
      )
    }
    
    if (state) {
      const states = state.split(',').map(s => s.trim())
      prospects = prospects.filter(p => 
        states.includes(p.location.state)
      )
    }
    
    if (status) {
      const statuses = status.split(',').map(s => s.trim())
      prospects = prospects.filter(p => 
        statuses.includes(p.status)
      )
    }
    
    if (minScore) {
      const min = parseInt(minScore, 10)
      if (!isNaN(min)) {
        prospects = prospects.filter(p => p.fitScore >= min)
      }
    }
    
    if (maxScore) {
      const max = parseInt(maxScore, 10)
      if (!isNaN(max)) {
        prospects = prospects.filter(p => p.fitScore <= max)
      }
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      prospects = prospects.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.org.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower)
      )
    }
    
    return NextResponse.json({
      success: true,
      data: prospects,
      count: prospects.length
    })
  } catch (error) {
    console.error('Error fetching prospects:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch prospects',
        message: error.message 
      },
      { status: 500 }
    )
  }
}


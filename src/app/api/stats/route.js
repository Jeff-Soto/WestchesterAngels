import { NextResponse } from 'next/server'
import { generateMockProspects, calculateStats } from '@/lib/mockData'

export async function GET(request) {
  try {
    // Get all prospects
    let prospects = generateMockProspects()
    
    // Get query parameters for filtering (same as prospects endpoint)
    const { searchParams } = new URL(request.url)
    const sector = searchParams.get('sector')
    const state = searchParams.get('state')
    const status = searchParams.get('status')
    const minScore = searchParams.get('minScore')
    const maxScore = searchParams.get('maxScore')
    const search = searchParams.get('search')
    
    // Apply filters (same logic as prospects endpoint)
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
    
    // Calculate stats from filtered prospects
    const stats = calculateStats(prospects)
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error calculating stats:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to calculate stats',
        message: error.message 
      },
      { status: 500 }
    )
  }
}


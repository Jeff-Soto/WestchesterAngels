import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { transformProspectForDashboard } from '@/lib/utils/transformProspect'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    
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
    
    // Find prospect by ID (can be string or number)
    const dbProspect = await collection.findOne({ 
      $or: [
        { id: id },
        { id: String(id) },
        { id: parseInt(id, 10) },
        { _id: id }
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

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    
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
    
    // Find prospect by ID
    const dbProspect = await collection.findOne({ 
      $or: [
        { id: id },
        { id: String(id) },
        { id: parseInt(id, 10) },
        { _id: id }
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

    // Prepare update data
    const updateData = {
      updatedAt: new Date()
    }

    // Update status if provided
    if (body.status !== undefined) {
      updateData.status = body.status
      
      // If status is 'contacted', also update lastContactedAt
      if (body.status === 'contacted') {
        updateData.lastContactedAt = new Date()
      }
    }

    // Update other fields if provided
    if (body.notes !== undefined) {
      updateData.notes = body.notes
    }

    // Update prospect in database
    const result = await collection.updateOne(
      { _id: dbProspect._id },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Prospect not found' 
        },
        { status: 404 }
      )
    }

    // Fetch updated prospect
    const updatedProspect = await collection.findOne({ _id: dbProspect._id })
    const transformed = transformProspectForDashboard(updatedProspect)

    return NextResponse.json({
      success: true,
      data: transformed,
      message: 'Prospect updated successfully'
    })
  } catch (error) {
    console.error('Error updating prospect:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update prospect',
        message: error.message 
      },
      { status: 500 }
    )
  }
}


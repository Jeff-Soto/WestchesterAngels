import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0-alpha',
    environment: process.env.NODE_ENV,
    services: {
      database: 'not_configured',
      openai: 'not_configured',
      crunchbase: 'not_configured',
      email: 'not_configured'
    }
  })
}


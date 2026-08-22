import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'unknown',
  }



  try {
    // Test database connectivity
    await prisma.$queryRaw`SELECT 1`
    health.database = 'connected'
  } catch (error) {
    health.status = 'degraded'
    health.database = 'disconnected'
  }

  return NextResponse.json(health, {
    status: health.status === 'ok' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
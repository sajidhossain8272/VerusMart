import { NextResponse } from 'next/server'
import { clearUserSession } from '@/lib/auth'

export async function POST(req: Request) {
  await clearUserSession()
  const contentType = req.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return NextResponse.json({ success: true })
  }
  return NextResponse.redirect(new URL('/', req.url))
}

export async function GET(req: Request) {
  await clearUserSession()
  return NextResponse.redirect(new URL('/', req.url))
}

import { NextResponse } from 'next/server'
import { getUserSession } from '@/lib/auth'

export async function GET() {
  const user = await getUserSession()
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null })
  }
  return NextResponse.json({ authenticated: true, user })
}

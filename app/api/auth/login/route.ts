import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

// Generate a signed session token
function generateSessionToken(userId: number) {
  const secret = process.env.SESSION_SECRET || 'dev-session-secret-change-me'
  const payload = `${userId}:${Date.now()}`
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}:${signature}`
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const email = (formData.get('email') as string || '').trim().toLowerCase()
    const password = formData.get('password') as string

    if (!email || !password) {
      return NextResponse.redirect(new URL('/login?error=emptyfields', req.url))
    }

    const user = await prisma.users.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=nouser', req.url))
    }

    const pwdCheck = await bcrypt.compare(password, user.password)

    if (pwdCheck) {
      const sessionToken = generateSessionToken(user.id)
      const response = NextResponse.redirect(new URL('/?login=success', req.url))
      response.cookies.set('user_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      return response
    } else {
      return NextResponse.redirect(new URL('/login?error=wrongpwd', req.url))
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.redirect(new URL('/login?error=servererror', req.url))
  }
}
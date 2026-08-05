import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { setUserSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || ''
    let email = ''
    let password = ''
    let isJson = false

    if (contentType.includes('application/json')) {
      isJson = true
      const body = await req.json()
      email = (body.email || '').trim().toLowerCase()
      password = body.password || ''
    } else {
      const formData = await req.formData()
      email = (formData.get('email') as string || '').trim().toLowerCase()
      password = formData.get('password') as string
    }

    if (!email || !password) {
      if (isJson) return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
      return NextResponse.redirect(new URL('/login?error=emptyfields', req.url))
    }

    const user = await prisma.users.findUnique({
      where: { email }
    })

    if (!user) {
      if (isJson) return NextResponse.json({ success: false, error: 'Account not found' }, { status: 400 })
      return NextResponse.redirect(new URL('/login?error=nouser', req.url))
    }

    const pwdCheck = await bcrypt.compare(password, user.password)

    if (pwdCheck) {
      await setUserSession({ id: user.id, name: user.full_name, email: user.email })
      if (isJson) {
        return NextResponse.json({ success: true, user: { id: user.id, name: user.full_name, email: user.email } })
      }
      return NextResponse.redirect(new URL('/?login=success', req.url))
    } else {
      if (isJson) return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 400 })
      return NextResponse.redirect(new URL('/login?error=wrongpwd', req.url))
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.redirect(new URL('/login?error=servererror', req.url))
  }
}
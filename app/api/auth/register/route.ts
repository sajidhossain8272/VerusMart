import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const full_name = (formData.get('name') as string || formData.get('full_name') as string || '').trim()
    const email = (formData.get('email') as string || '').trim().toLowerCase()
    const phone = (formData.get('phone') as string || '').trim()
    const password = formData.get('password') as string
    const confirm_password = formData.get('confirm_password') as string

    if (!full_name || !email || !phone || !password) {
      return NextResponse.redirect(new URL('/register?error=emptyfields', req.url))
    }

    if (password !== confirm_password) {
      return NextResponse.redirect(new URL('/register?error=passwordmismatch', req.url))
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.redirect(new URL('/register?error=invalidemail', req.url))
    }

    // Validate phone (Bangladesh format: 01XXXXXXXXX or +8801XXXXXXXXX)
    const phoneRegex = /^(\+?880|0)1[3-9]\d{8}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.redirect(new URL('/register?error=invalidphone', req.url))
    }

    // Validate password strength (min 8 chars)
    if (password.length < 8) {
      return NextResponse.redirect(new URL('/register?error=weakpassword', req.url))
    }

    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.redirect(new URL('/register?error=userexists', req.url))
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.users.create({
      data: {
        full_name,
        email,
        phone,
        password: hashedPassword,
        status: 'active'
      }
    })

    return NextResponse.redirect(new URL('/login?register=success', req.url))
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.redirect(new URL('/register?error=servererror', req.url))
  }
}
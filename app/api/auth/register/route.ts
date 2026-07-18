import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const full_name = formData.get('full_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const password = formData.get('password') as string
    const confirm_password = formData.get('confirm_password') as string

    if (!full_name || !email || !phone || !password) {
      return NextResponse.redirect(new URL('/register?error=emptyfields', req.url))
    }

    if (password !== confirm_password) {
      return NextResponse.redirect(new URL('/register?error=passwordmismatch', req.url))
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
    return NextResponse.redirect(new URL('/register?error=servererror', req.url))
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const email = formData.get('email') as string
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
      // Create session mechanism here (e.g. JWT token or Iron Session)
      // For this migration, we simulate success response with cookie
      const response = NextResponse.redirect(new URL('/?login=success', req.url))
      response.cookies.set('user_id', user.id.toString(), { path: '/' })
      return response
    } else {
      return NextResponse.redirect(new URL('/login?error=wrongpwd', req.url))
    }
  } catch (error) {
    return NextResponse.redirect(new URL('/login?error=servererror', req.url))
  }
}

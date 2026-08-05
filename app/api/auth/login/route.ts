import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { setUserSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || ''
    let email = ''
    let password = ''
    let redirectUrl = ''
    let isJson = false

    if (contentType.includes('application/json')) {
      isJson = true
      const body = await req.json()
      email = (body.email || '').trim().toLowerCase()
      password = body.password || ''
      redirectUrl = body.redirect || ''
    } else {
      const formData = await req.formData()
      email = (formData.get('email') as string || '').trim().toLowerCase()
      password = formData.get('password') as string
      redirectUrl = formData.get('redirect') as string || ''
    }

    const errorRedirect = (errType: string) => {
      const target = new URL('/login', req.url)
      target.searchParams.set('error', errType)
      if (redirectUrl) target.searchParams.set('redirect', redirectUrl)
      return NextResponse.redirect(target)
    }

    if (!email || !password) {
      if (isJson) return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
      return errorRedirect('emptyfields')
    }

    const user = await prisma.users.findUnique({
      where: { email }
    })

    if (!user) {
      if (isJson) return NextResponse.json({ success: false, error: 'Account not found' }, { status: 400 })
      return errorRedirect('nouser')
    }

    const pwdCheck = await bcrypt.compare(password, user.password)

    if (pwdCheck) {
      await setUserSession({ id: user.id, name: user.full_name, email: user.email })
      if (isJson) {
        return NextResponse.json({ success: true, user: { id: user.id, name: user.full_name, email: user.email } })
      }
      const destination = redirectUrl || '/account'
      return NextResponse.redirect(new URL(destination, req.url))
    } else {
      if (isJson) return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 400 })
      return errorRedirect('wrongpwd')
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.redirect(new URL('/login?error=servererror', req.url))
  }
}
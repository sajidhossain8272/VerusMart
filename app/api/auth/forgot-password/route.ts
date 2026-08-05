import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOTPEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    const cleanEmail = (email || '').trim().toLowerCase()

    if (!cleanEmail) {
      return NextResponse.json({ success: false, error: 'Email address is required' }, { status: 400 })
    }

    const user = await prisma.users.findUnique({
      where: { email: cleanEmail }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'No account found with this email address.'
      }, { status: 404 })
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 mins

    await prisma.users.update({
      where: { id: user.id },
      data: {
        otp_code: otpCode,
        otp_expires: otpExpires
      }
    })

    // Send email using Nodemailer Google App Passwords
    await sendOTPEmail(cleanEmail, otpCode, user.full_name)

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}.`
    })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send reset email. Please try again.'
    }, { status: 500 })
  }
}

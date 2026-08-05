import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  try {
    const { email, otpCode, newPassword } = await req.json()
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanOtp = (otpCode || '').trim()

    if (!cleanEmail || !cleanOtp || !newPassword) {
      return NextResponse.json({
        success: false,
        error: 'Email, OTP code, and new password are required.'
      }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 8 characters long.'
      }, { status: 400 })
    }

    const user = await prisma.users.findUnique({
      where: { email: cleanEmail }
    })

    if (!user || !user.otp_code) {
      return NextResponse.json({
        success: false,
        error: 'Invalid password reset request.'
      }, { status: 400 })
    }

    if (user.otp_code !== cleanOtp) {
      return NextResponse.json({
        success: false,
        error: 'Incorrect OTP verification code. Please check your email.'
      }, { status: 400 })
    }

    if (!user.otp_expires || new Date(user.otp_expires) < new Date()) {
      return NextResponse.json({
        success: false,
        error: 'OTP code has expired. Please request a new code.'
      }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otp_code: null,
        otp_expires: null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.'
    })
  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to reset password. Please try again.'
    }, { status: 500 })
  }
}

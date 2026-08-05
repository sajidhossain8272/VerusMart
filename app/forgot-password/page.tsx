'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      })

      const data = await res.json()
      if (data.success) {
        setStep(2)
        setFeedback({ type: 'success', message: data.message || 'OTP verification code sent to your email!' })
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to send OTP.' })
      }
    } catch {
      setFeedback({ type: 'error', message: 'A network error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' })
      return
    }

    if (newPassword.length < 8) {
      setFeedback({ type: 'error', message: 'Password must be at least 8 characters long.' })
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otpCode: otpCode.trim(),
          newPassword
        })
      })

      const data = await res.json()
      if (data.success) {
        setFeedback({ type: 'success', message: 'Password reset successfully! Redirecting to login...' })
        setTimeout(() => {
          router.push('/login?register=success')
        }, 1500)
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to reset password.' })
      }
    } catch {
      setFeedback({ type: 'error', message: 'A network error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="-mt-0 -mb-16 lg:mb-0 bg-gradient-to-br from-[#002b5b] via-[#001c3d] to-[#0a1128] min-h-[calc(100vh-140px)] flex items-center justify-center font-sans p-4 sm:p-8 relative overflow-hidden py-12">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#f85606]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[440px] p-6 sm:p-10 z-10 border border-gray-100/80 transition-all">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-3">
            <img src="/admin_uploads/logo.png" alt="VerusMart" className="h-10 w-auto object-contain mx-auto" />
          </Link>
          <p className="text-xs font-black uppercase tracking-widest text-[#002b5b]/60">Account Security</p>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#002b5b] tracking-tight">Reset Password</h2>
          <p className="text-xs text-gray-500 mt-1">
            {step === 1 ? 'Enter your account email to receive a 6-digit OTP code.' : 'Enter the 6-digit OTP sent to your email and your new password.'}
          </p>
        </div>

        {/* Feedback Banners */}
        {feedback && (
          <div className={`mb-6 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-green-50 border border-green-100 text-green-700'
              : 'bg-red-50 border border-red-100 text-red-600'
          }`}>
            <i className={`fa-solid ${feedback.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} text-sm shrink-0`}></i>
            <span>{feedback.message}</span>
          </div>
        )}

        {/* STEP 1: EMAIL ENTRY */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-2">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 outline-none text-xs font-medium text-gray-900 transition-all focus:border-[#f85606] focus:ring-2 focus:ring-orange-500/10 bg-gray-50/50 focus:bg-white"
                />
                <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-[#f85606] hover:bg-[#d04300] text-white font-black py-4 rounded-2xl cursor-pointer transition-all shadow-lg shadow-orange-500/20 text-sm tracking-wide active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Sending OTP...
                </>
              ) : (
                <>
                  Send OTP Code <i className="fa-solid fa-paper-plane text-xs"></i>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: OTP & NEW PASSWORD */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-1.5">
                6-Digit OTP Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 outline-none text-sm font-mono font-bold tracking-widest text-gray-900 focus:border-[#f85606] bg-gray-50/50 focus:bg-white"
                />
                <i className="fa-solid fa-shield-halved absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 outline-none text-xs font-medium text-gray-900 focus:border-[#f85606] bg-gray-50/50 focus:bg-white"
                />
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 outline-none text-xs font-medium text-gray-900 focus:border-[#f85606] bg-gray-50/50 focus:bg-white"
                />
                <i className="fa-solid fa-check-double absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !otpCode.trim() || !newPassword}
              className="w-full bg-[#f85606] hover:bg-[#d04300] text-white font-black py-4 rounded-2xl cursor-pointer transition-all shadow-lg shadow-orange-500/20 text-sm tracking-wide active:scale-98 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Updating Password...
                </>
              ) : (
                <>
                  Reset Password Now <i className="fa-solid fa-key text-xs"></i>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs font-bold text-gray-400 hover:text-gray-700 py-1"
            >
              ← Change Email Address
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Remembered your password?{' '}
            <Link href="/login" className="text-[#f85606] font-black hover:underline ml-1">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

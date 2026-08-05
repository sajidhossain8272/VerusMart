import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ error?: string; redirect?: string }>
}

export default async function RegisterPage({ searchParams }: Props) {
  const params = await searchParams
  const errorParam = params.error || ''
  const redirectParam = params.redirect || ''

  const settings = await prisma.business_settings.findFirst({ where: { id: 1 } }).catch(() => null)
  const companyName = settings?.company_name || 'Verus Mart'

  const errorMessages: Record<string, string> = {
    emptyfields: 'Please fill in all required fields.',
    passwordmismatch: 'Passwords do not match. Please re-enter your password.',
    invalidemail: 'Please enter a valid email address.',
    invalidphone: 'Please enter a valid Bangladesh phone number (e.g. 01712345678).',
    weakpassword: 'Password must be at least 8 characters long.',
    userexists: 'An account with this email address or phone number already exists.',
    servererror: 'An unexpected server error occurred. Please try again later.'
  }

  const errorMessage = errorMessages[errorParam] || ''

  return (
    <div className="-mt-0 -mb-16 lg:mb-0 bg-gradient-to-br from-[#002b5b] via-[#001c3d] to-[#0a1128] min-h-[calc(100vh-140px)] flex items-center justify-center font-sans p-4 sm:p-6 relative overflow-hidden py-12">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#f85606]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[460px] p-6 sm:p-10 z-10 border border-gray-100/80 transition-all">
        
        {/* Brand Logo Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-3">
            <img src="/admin_uploads/logo.png" alt={companyName} className="h-10 w-auto object-contain mx-auto" />
          </Link>
          <p className="text-xs font-black uppercase tracking-widest text-[#002b5b]/60">Customer Access Portal</p>
        </div>

        {/* Auth Tab Switcher */}
        <div className="grid grid-cols-2 bg-gray-100 p-1.5 rounded-2xl mb-8 border border-gray-200/60">
          <Link
            href={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login'}
            className="py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors text-center"
          >
            Sign In
          </Link>
          <button className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-white text-[#f85606] shadow-sm">
            Sign Up
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#002b5b] tracking-tight">Create an Account</h2>
          <p className="text-xs text-gray-500 mt-1">Join Verus Mart to track orders, save addresses, and earn rewards.</p>
        </div>

        {/* Error Banners */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-semibold flex items-center gap-2.5">
            <i className="fa-solid fa-circle-exclamation text-sm shrink-0"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form action="/api/auth/register" method="POST" className="space-y-4">
          {redirectParam && <input type="hidden" name="redirect" value={redirectParam} />}

          <div>
            <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                name="name" 
                placeholder="e.g. Sajid Hossain" 
                required 
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 outline-none text-xs font-medium text-gray-900 transition-all focus:border-[#f85606] focus:ring-2 focus:ring-orange-500/10 bg-gray-50/50 focus:bg-white"
              />
              <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="email" 
                name="email" 
                placeholder="name@example.com" 
                required 
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 outline-none text-xs font-medium text-gray-900 transition-all focus:border-[#f85606] focus:ring-2 focus:ring-orange-500/10 bg-gray-50/50 focus:bg-white"
              />
              <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="tel" 
                name="phone" 
                placeholder="017XXXXXXXX" 
                required 
                pattern="^(\+?880|0)1[3-9]\d{8}$"
                title="Please enter a valid Bangladesh phone number (e.g. 01712345678)"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 outline-none text-xs font-medium text-gray-900 transition-all focus:border-[#f85606] focus:ring-2 focus:ring-orange-500/10 bg-gray-50/50 focus:bg-white"
              />
              <i className="fa-solid fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="password" 
                name="password" 
                placeholder="Min 8 characters" 
                required 
                minLength={8}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 outline-none text-xs font-medium text-gray-900 transition-all focus:border-[#f85606] focus:ring-2 focus:ring-orange-500/10 bg-gray-50/50 focus:bg-white"
              />
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-1.5">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="password" 
                name="confirm_password" 
                placeholder="Re-enter password" 
                required 
                minLength={8}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 outline-none text-xs font-medium text-gray-900 transition-all focus:border-[#f85606] focus:ring-2 focus:ring-orange-500/10 bg-gray-50/50 focus:bg-white"
              />
              <i className="fa-solid fa-check-double absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#f85606] hover:bg-[#d04300] text-white font-black py-4 rounded-2xl cursor-pointer transition-all shadow-lg shadow-orange-500/20 text-sm tracking-wide active:scale-98 flex items-center justify-center gap-2 mt-2"
          >
            Create Account <i className="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link 
              href={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login'}
              className="text-[#f85606] font-black hover:underline ml-1"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
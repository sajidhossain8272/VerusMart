import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function RegisterPage() {
  const settings = await prisma.business_settings.findFirst({ where: { id: 1 } }).catch(() => null)
  const companyName = settings?.company_name || 'Verus Mart'
  const logoPath = settings?.logo ? `/admin_uploads/business/${settings.logo}` : '/assets/images/logo.png'

  return (
    <div className="bg-[#00bcd4] min-h-screen flex items-center justify-center font-inter p-5">
      <div className="bg-white rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.1)] w-full max-w-[420px] p-[40px_30px] flex flex-col items-center">
        
        <div className="w-[80px] h-[80px] rounded-full overflow-hidden border-[3px] border-[#00bcd4] flex items-center justify-center bg-white mb-[25px]">
          <img src={logoPath} alt={companyName} className="max-w-[80%] max-h-[80%] object-contain" />
        </div>

        <h2 className="text-[26px] font-extrabold text-[#1e293b] mb-[5px]">Create Account</h2>
        <p className="text-[14px] text-gray-500 mb-[30px]">Join us today</p>

        <form action="/api/auth/register" method="POST" className="w-full flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-semibold text-[#1e293b]">Full Name</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Your Name" 
              required 
              className="w-full p-[12px_16px] rounded-xl border border-gray-200 outline-none text-[14px] transition-all focus:border-[#00bcd4] focus:ring-2 focus:ring-[#00bcd4]/20"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-semibold text-[#1e293b]">Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="name@example.com" 
              required 
              className="w-full p-[12px_16px] rounded-xl border border-gray-200 outline-none text-[14px] transition-all focus:border-[#00bcd4] focus:ring-2 focus:ring-[#00bcd4]/20"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-semibold text-[#1e293b]">Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              placeholder="01XXXXXXXXX" 
              required 
              pattern="^(\+?880|0)1[3-9]\d{8}$"
              title="Please enter a valid Bangladesh phone number (e.g. 01712345678)"
              className="w-full p-[12px_16px] rounded-xl border border-gray-200 outline-none text-[14px] transition-all focus:border-[#00bcd4] focus:ring-2 focus:ring-[#00bcd4]/20"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-semibold text-[#1e293b]">Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Min 8 characters" 
              required 
              minLength={8}
              className="w-full p-[12px_16px] rounded-xl border border-gray-200 outline-none text-[14px] transition-all focus:border-[#00bcd4] focus:ring-2 focus:ring-[#00bcd4]/20"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-semibold text-[#1e293b]">Confirm Password</label>
            <input 
              type="password" 
              name="confirm_password" 
              placeholder="Re-enter password" 
              required 
              minLength={8}
              className="w-full p-[12px_16px] rounded-xl border border-gray-200 outline-none text-[14px] transition-all focus:border-[#00bcd4] focus:ring-2 focus:ring-[#00bcd4]/20"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold p-[14px] rounded-xl cursor-pointer transition-all shadow-md text-[15px] mt-[10px]"
          >
            Sign Up
          </button>
        </form>

        <p className="text-[14px] text-gray-500 mt-[25px]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#00bcd4] font-bold hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}
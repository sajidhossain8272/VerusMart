import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const settings = await prisma.business_settings.findFirst({ where: { id: 1 } }).catch(() => null)
  const companyName = settings?.company_name || 'Verus Mart'
  const logoPath = settings?.logo ? `/admin_uploads/business/${settings.logo}` : '/assets/images/logo.png'

  return (
    <div className="bg-[#00bcd4] min-h-screen flex items-center justify-center font-inter p-5">
      <div className="bg-white rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.1)] w-full max-w-[420px] p-[40px_30px] flex flex-col items-center">
        
        <div className="w-[80px] h-[80px] rounded-full overflow-hidden border-[3px] border-[#00bcd4] flex items-center justify-center bg-white mb-[25px]">
          <img src={logoPath} alt={companyName} className="max-w-[80%] max-h-[80%] object-contain" />
        </div>

        <h2 className="text-[26px] font-extrabold text-[#1e293b] mb-[5px]">Welcome Back</h2>
        <p className="text-[14px] text-gray-500 mb-[30px]">Login to continue</p>

        <form action="/api/auth/login" method="POST" className="w-full flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-semibold text-[#1e293b]">Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="admin@verusmart.com" 
              required 
              className="w-full p-[12px_16px] rounded-xl border border-gray-200 outline-none text-[14px] transition-all focus:border-[#00bcd4] focus:ring-2 focus:ring-[#00bcd4]/20"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-semibold text-[#1e293b]">Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              required 
              className="w-full p-[12px_16px] rounded-xl border border-gray-200 outline-none text-[14px] transition-all focus:border-[#00bcd4] focus:ring-2 focus:ring-[#00bcd4]/20"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold p-[14px] rounded-xl cursor-pointer transition-all shadow-md text-[15px] mt-[10px]"
          >
            Sign In
          </button>
        </form>

      </div>
    </div>
  )
}

import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function RegisterPage() {
  const settings = await prisma.business_settings.findFirst({ where: { id: 1 } })
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
          
          <div className="relative">
            <span className="absolute left-[15px] top-[14px] text-gray-400"><i className="fa-solid fa-user"></i></span>
            <input type="text" name="full_name" placeholder="Full Name" required className="w-full h-[48px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] pl-[45px] pr-[15px] font-inter text-[15px] text-[#1e293b] outline-none transition-all focus:border-[#00bcd4] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,188,212,0.1)]" />
          </div>

          <div className="relative">
            <span className="absolute left-[15px] top-[14px] text-gray-400"><i className="fa-solid fa-envelope"></i></span>
            <input type="email" name="email" placeholder="Email Address" required className="w-full h-[48px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] pl-[45px] pr-[15px] font-inter text-[15px] text-[#1e293b] outline-none transition-all focus:border-[#00bcd4] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,188,212,0.1)]" />
          </div>
          
          <div className="relative">
            <span className="absolute left-[15px] top-[14px] text-gray-400"><i className="fa-solid fa-phone"></i></span>
            <input type="text" name="phone" placeholder="Phone Number" required className="w-full h-[48px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] pl-[45px] pr-[15px] font-inter text-[15px] text-[#1e293b] outline-none transition-all focus:border-[#00bcd4] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,188,212,0.1)]" />
          </div>

          <div className="relative">
            <span className="absolute left-[15px] top-[14px] text-gray-400"><i className="fa-solid fa-lock"></i></span>
            <input type="password" name="password" id="password" placeholder="Password" required className="w-full h-[48px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] pl-[45px] pr-[45px] font-inter text-[15px] text-[#1e293b] outline-none transition-all focus:border-[#00bcd4] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,188,212,0.1)]" />
          </div>
          
           <div className="relative">
            <span className="absolute left-[15px] top-[14px] text-gray-400"><i className="fa-solid fa-lock"></i></span>
            <input type="password" name="confirm_password" id="confirm_password" placeholder="Confirm Password" required className="w-full h-[48px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] pl-[45px] pr-[45px] font-inter text-[15px] text-[#1e293b] outline-none transition-all focus:border-[#00bcd4] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,188,212,0.1)]" />
          </div>

          <button type="submit" className="w-full h-[48px] bg-[#ac3255] text-white border-none rounded-[10px] font-bold text-[16px] cursor-pointer mt-[10px] transition-all hover:bg-[#8b2844] hover:-translate-y-[2px] shadow-[0_4px_10px_rgba(172,50,85,0.3)]">Register</button>

        </form>

        <p className="mt-[25px] text-[14px] text-gray-500">
          Already have an account? <Link href="/login" className="text-[#00bcd4] font-bold hover:underline">Login</Link>
        </p>

      </div>
    </div>
  )
}

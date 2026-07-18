import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function Footer() {
  const biz = await prisma.business_settings.findFirst({
    where: { id: 1 }
  })

  return (
    <footer className="bg-[#2e2e2e] text-white pt-[60px] pb-[40px] px-[8%] mt-[50px] font-roboto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px] mb-[40px]">
        
        {/* Section 1 */}
        <div>
          {biz?.logo && <img src={`/admin_uploads/business/${biz.logo}`} alt="Logo" className="h-[45px] w-auto object-contain mb-[20px]" />}
          <p className="text-[13px] leading-[1.6] text-[#ababab] max-w-[300px]">
            {biz?.footer_about || "Verus Mart is your ultimate online shopping destination. Discover the best products with top-notch service and quick delivery."}
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <h4 className="text-[16px] font-semibold text-white uppercase mb-[20px]">Customer Care</h4>
          <ul className="list-none flex flex-col gap-[10px]">
            <li><Link href="#" className="text-[13px] text-[#ababab] hover:text-[#f85606] transition-colors">Help Center</Link></li>
            <li><Link href="#" className="text-[13px] text-[#ababab] hover:text-[#f85606] transition-colors">How to Buy</Link></li>
            <li><Link href="#" className="text-[13px] text-[#ababab] hover:text-[#f85606] transition-colors">Returns & Refunds</Link></li>
            <li><Link href="/contact" className="text-[13px] text-[#ababab] hover:text-[#f85606] transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Section 3 */}
        <div>
          <h4 className="text-[16px] font-semibold text-white uppercase mb-[20px]">Verus Mart</h4>
          <ul className="list-none flex flex-col gap-[10px]">
            <li><Link href="/about" className="text-[13px] text-[#ababab] hover:text-[#f85606] transition-colors">About Us</Link></li>
            <li><Link href="#" className="text-[13px] text-[#ababab] hover:text-[#f85606] transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="text-[13px] text-[#ababab] hover:text-[#f85606] transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Section 4 */}
        <div>
          <h4 className="text-[16px] font-semibold text-white uppercase mb-[20px]">Contact Info</h4>
          <ul className="list-none flex flex-col gap-[12px]">
            <li className="flex items-start gap-[10px] text-[13px] text-[#ababab]">
              <i className="fa-solid fa-location-dot mt-[4px] text-[#f85606]"></i>
              <span>{biz?.address || 'Your Address'}</span>
            </li>
            <li className="flex items-center gap-[10px] text-[13px] text-[#ababab]">
              <i className="fa-solid fa-phone text-[#f85606]"></i>
              <span>{biz?.phone || 'Your Phone'}</span>
            </li>
            <li className="flex items-center gap-[10px] text-[13px] text-[#ababab]">
              <i className="fa-solid fa-envelope text-[#f85606]"></i>
              <span>{biz?.email || 'Your Email'}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="text-center pt-[20px] border-t border-[#444] text-[12px] text-[#888]">
        &copy; {new Date().getFullYear()} {biz?.company_name || 'Verus Mart'}. All Rights Reserved.
      </div>
    </footer>
  )
}

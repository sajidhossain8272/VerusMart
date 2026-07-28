import Link from 'next/link'
import { prisma } from '@/lib/prisma'

let cachedBiz: any = null

async function getBizSettings() {
  if (cachedBiz) return cachedBiz
  try {
    const res = await prisma.business_settings.findFirst({ where: { id: 1 } })
    if (res) cachedBiz = res
    return res
  } catch {
    return cachedBiz || null
  }
}

export default async function Footer() {
  const biz = await getBizSettings()

  return (
    <footer className="bg-[#2e2e2e] text-white pt-[60px] pb-[40px] px-[8%] mt-[50px] font-roboto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px] mb-[40px]">
        
        {/* Section 1 */}
        <div>
          <img src="/admin_uploads/logo.png" alt="VerusMart Logo" className="h-[30px] w-auto object-contain mb-[20px] filter brightness-0 invert" />
          <p className="text-[13px] leading-[1.6] text-[#ababab] max-w-[300px]">
            {biz?.footer_about || "Verus Mart is your ultimate online shopping destination. Discover the best products with top-notch service and quick delivery."}
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <h4 className="text-[16px] font-semibold text-white uppercase mb-[20px]">Customer Care</h4>
          <ul className="list-none flex flex-col gap-[10px]">
            <li><Link href="/help-center" className="text-[13px] text-[#ababab] hover:text-[#f85606] transition-colors">Help Center</Link></li>
            <li><Link href="/how-to-buy" className="text-[13px] text-[#ababab] hover:text-[#f85606] transition-colors">How to Buy</Link></li>
            <li><Link href="/returns-refunds" className="text-[13px] text-[#ababab] hover:text-[#f85606] transition-colors">Returns & Refunds</Link></li>
            <li><Link href="/contact" className="text-[13px] text-[#ababab] hover:text-[#f85606] transition-colors">Contact Us</Link></li>
            <li><Link href="/terms-conditions" className="text-[13px] text-[#ababab] hover:text-[#f85606] transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Section 3 */}
        <div>
          <h4 className="text-[16px] font-semibold text-white uppercase mb-[20px]">Verus Mart</h4>
          <ul className="list-none flex flex-col gap-[10px]">
            <li><Link href="/about" className="text-[13px] text-[#ababab] hover:text-[#f85606] transition-colors">About Us</Link></li>
            <li><Link href="/privacy-policy" className="text-[13px] text-[#ababab] hover:text-[#f85606] transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Section 4 */}
        <div>
          <h4 className="text-[16px] font-semibold text-white uppercase mb-[20px]">Contact Info</h4>
          <div className="flex flex-col gap-[12px]">
            <p className="text-[13px] text-[#ababab] flex items-center gap-[10px]">
              <i className="fa-solid fa-[#f85606] fa-location-dot text-[#f85606]"></i> {biz?.address || 'Dhaka, Bangladesh'}
            </p>
            <p className="text-[13px] text-[#ababab] flex items-center gap-[10px]">
              <i className="fa-solid fa-[#f85606] fa-phone text-[#f85606]"></i> {biz?.phone || '+880 1700-000000'}
            </p>
            <p className="text-[13px] text-[#ababab] flex items-center gap-[10px]">
              <i className="fa-solid fa-[#f85606] fa-envelope text-[#f85606]"></i> {biz?.email || 'support@verusmart.com'}
            </p>
          </div>
        </div>

      </div>

      <div className="border-t border-[#444] pt-[20px] text-center text-[12px] text-[#888]">
        &copy; {new Date().getFullYear()} Verus Mart. All Rights Reserved.
      </div>
    </footer>
  )
}

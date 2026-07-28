import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import CartCountBadge from './CartCountBadge'

let cachedSettings: any = null
let cachedCategories: any[] = []

async function getSettings() {
  if (cachedSettings) return cachedSettings
  try {
    const res = await prisma.business_settings.findFirst({ where: { id: 1 } })
    if (res) cachedSettings = res
    return res
  } catch {
    return cachedSettings || null
  }
}

async function getCategories() {
  if (cachedCategories.length > 0) return cachedCategories
  try {
    const res = await prisma.categories.findMany({ orderBy: { priority: 'asc' } })
    if (res.length > 0) cachedCategories = res
    return res
  } catch {
    return cachedCategories || []
  }
}

export default async function Header() {
  const siteSettings = await getSettings()
  const rawCats = await getCategories()

  const headerCats = rawCats.filter(c => !c.status || String(c.status) === 'active')

  const companyName = siteSettings?.company_name || 'Verus Mart'
  const finalLogo = siteSettings?.logo ? `/admin_uploads/business/${siteSettings.logo}` : '/assets/images/logo.png'

  return (
    <>
      {/* Desktop Top Nav */}
      <div className="hidden lg:flex bg-[#f5f5f5] text-[12px] px-[8%] py-[5px] justify-end gap-[20px] text-[#555]">
        <Link href="#" className="hover:text-[#f85606]">CUSTOMER CARE</Link>
        <Link href="/track-order" className="hover:text-[#f85606]">TRACK MY ORDER</Link>
      </div>

      {/* Main Header Desktop */}
      <header className="hidden lg:flex bg-white py-[15px] px-[8%] items-center justify-between gap-[30px] sticky top-0 z-[1000] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <Link href="/" className="flex items-center">
          <img src="/admin_uploads/logo.png" alt="VerusMart" className="h-[36px] w-auto object-contain" />
        </Link>

        <div className="flex-1 relative flex">
          <form action="/products" method="GET" className="w-full flex">
            <input type="text" name="search" placeholder="Search in Verus Mart..." required className="w-full py-[12px] px-[20px] bg-[#eff0f5] border-none rounded-lg outline-none text-[14px]" />
            <button type="submit" className="absolute right-0 top-0 h-full w-[50px] bg-[#ffe1d2] border-none rounded-r-lg text-[#f85606] cursor-pointer"><i className="fa fa-search"></i></button>
          </form>
        </div>

        <div className="flex items-center gap-[20px]">
          <Link href="/wishlist" className="text-[#444] text-[22px] relative"><i className="fa-regular fa-heart"></i></Link>
          <Link href="/cart" className="text-[#444] text-[22px] relative">
            <i className="fa-solid fa-cart-shopping"></i>
            <CartCountBadge />
          </Link>
        </div>
      </header>

      {/* Nav Bar Desktop */}
      <nav className="hidden lg:flex bg-white px-[8%] border-b border-[#eee] items-center">
        <div className="relative py-[12px] cursor-pointer text-[#212121] font-medium text-[14px] flex items-center gap-[8px] group">
          <i className="fa-solid fa-list-ul"></i> Categories <i className="fa-solid fa-chevron-down text-[10px] text-[#888]"></i>
          <ul className="absolute top-[100%] left-0 w-[240px] bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] hidden group-hover:block list-none z-[999] rounded-b-lg">
            {headerCats.map(cat => (
              <li key={cat.id}><Link href={`/products?category=${cat.id}`} className="block py-[12px] px-[20px] text-[#333] text-[13px] border-b border-[#f5f5f5] hover:bg-[#fafafa] hover:text-[#f85606]">{cat.name}</Link></li>
            ))}
          </ul>
        </div>
        <ul className="flex list-none ml-[40px]">
          <li><Link href="/" className="text-[#444] py-[12px] px-[15px] text-[13px] font-medium hover:text-[#f85606]">Home</Link></li>
          <li><Link href="/products" className="text-[#444] py-[12px] px-[15px] text-[13px] font-medium hover:text-[#f85606]">Collections</Link></li>
          <li><Link href="/products?type=hot" className="text-[#444] py-[12px] px-[15px] text-[13px] font-medium hover:text-[#f85606]">Hot Deals</Link></li>
          <li><Link href="/products?type=weekly" className="text-[#444] py-[12px] px-[15px] text-[13px] font-medium hover:text-[#f85606]">Weekly Deals</Link></li>
          <li><Link href="/serving-area" className="text-[#444] py-[12px] px-[15px] text-[13px] font-medium hover:text-[#f85606]">Serving Area</Link></li>
        </ul>
      </nav>

      {/* Mobile Header */}
      <div className="flex lg:hidden bg-white p-[10px_15px] items-center justify-between border-b border-[#eee] sticky top-0 z-[1001]">
        <div className="w-[50px] flex items-center"><i className="fa-solid fa-bars text-[22px] text-[#444] cursor-pointer"></i></div>
        <div className="flex-1 flex justify-center items-center">
           <Link href="/" className="flex items-center justify-center">
             <img src="/admin_uploads/logo.png" alt="VerusMart" className="h-[28px] w-auto object-contain" />
          </Link>
        </div>
        <div className="w-[50px] flex items-center justify-end">
           <Link href="/cart" className="text-[#444] text-[20px] relative">
            <i className="fa-solid fa-cart-shopping"></i>
            <CartCountBadge />
          </Link>
        </div>
      </div>
    </>
  )
}

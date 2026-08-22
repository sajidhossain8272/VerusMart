import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getUserSession } from '@/lib/auth'
import CartCountBadge from './CartCountBadge'
import MobileMenuClient from './MobileMenuClient'
import SearchInput from './SearchInput'

async function getSettings() {
  try {
    return await prisma.business_settings.findFirst({ where: { id: 1 } })
  } catch {
    return null
  }
}

async function getCategories() {
  try {
    return await prisma.categories.findMany({ orderBy: { priority: 'asc' } })
  } catch {
    return []
  }
}

export default async function Header() {
  try {
    const siteSettings = await getSettings()
    const rawCats = await getCategories()
    const user = await getUserSession().catch(() => null)

    const headerCats = (rawCats || []).filter(c => c && (!c.status || String(c.status) === 'active'))
    const serializedCats = headerCats.map(c => ({ id: c.id, name: c.name }))

    return (
      <>
        {/* Desktop Top Nav */}
        <div className="hidden lg:flex bg-[#f5f5f5] text-[12px] px-[8%] py-[6px] justify-between items-center text-[#555] font-medium border-b border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>📞 {siteSettings?.phone || '+880 1700-000000'}</span>
            <span>✉️ {siteSettings?.email || 'support@verusmart.com'}</span>
          </div>
          <div className="flex items-center gap-[20px]">
            <Link href="/help-center" className="hover:text-[#f85606] transition-colors">CUSTOMER CARE</Link>
            <Link href="/track-order" className="hover:text-[#f85606] transition-colors">TRACK MY ORDER</Link>
            {user ? (
              <Link href="/account" className="text-[#f85606] font-bold flex items-center gap-1.5 hover:underline">
                <i className="fa-solid fa-user-check"></i> {user.full_name ? user.full_name.split(' ')[0] : user.email ? user.email.split('@')[0] : 'My Account'}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="hover:text-[#f85606]">LOGIN</Link>
                <span>/</span>
                <Link href="/register" className="hover:text-[#f85606]">REGISTER</Link>
              </div>
            )}
          </div>
        </div>


        {/* Main Header Desktop */}
        <header className="hidden lg:flex bg-white py-[15px] px-[8%] items-center justify-between gap-[30px] sticky top-0 z-[1000] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <Link href="/" className="flex items-center">
            <img src="/admin_uploads/logo.png" alt="VerusMart" className="h-[36px] w-auto object-contain" />
          </Link>

          {/* Interactive Live Search */}
          <SearchInput />

          <div className="flex items-center gap-[20px]">
            <Link href="/wishlist" className="text-[#444] text-[22px] relative hover:text-[#f85606] transition-colors" title="Wishlist">
              <i className="fa-regular fa-heart"></i>
            </Link>
            <Link href="/account" className="text-[#444] text-[22px] relative hover:text-[#f85606] transition-colors" title="My Account">
              <i className="fa-regular fa-user"></i>
            </Link>
            <Link href="/cart" className="text-[#444] text-[22px] relative hover:text-[#f85606] transition-colors" title="Shopping Cart">
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
                <li key={cat.id}>
                  <Link href={`/products?category=${cat.id}`} className="block py-[12px] px-[20px] text-[#333] text-[13px] border-b border-[#f5f5f5] hover:bg-[#fafafa] hover:text-[#f85606]">
                    {cat.name}
                  </Link>
                </li>
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
        <div className="flex lg:hidden bg-white items-center justify-between border-b border-[#eee] sticky top-0 z-[1001] shadow-sm">
          <MobileMenuClient categories={serializedCats} />
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <img src="/admin_uploads/logo.png" alt="VerusMart" className="h-[28px] w-auto object-contain" />
          </Link>
          <Link href="/cart" className="ml-auto p-3 text-[#444] text-[20px] relative">
            <i className="fa-solid fa-cart-shopping"></i>
            <CartCountBadge />
          </Link>
        </div>
      </>
    )
  } catch (err) {
    console.error('Error in Header component:', err)
    return (
      <header className="bg-white py-3 px-6 shadow-sm flex items-center justify-between">
        <Link href="/">
          <img src="/admin_uploads/logo.png" alt="VerusMart" className="h-8 w-auto object-contain" />
        </Link>
        <div className="flex gap-4 text-xs font-bold">
          <Link href="/products" className="text-[#002b5b]">Products</Link>
          <Link href="/cart" className="text-[#f85606]">Cart</Link>
        </div>
      </header>
    )
  }
}

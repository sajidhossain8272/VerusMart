import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import HomeSlider from '@/app/components/HomeSlider'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const rawSlides = await prisma.banners.findMany({
    orderBy: { id: 'desc' }
  }).catch(() => [])

  const activeSlides = rawSlides.filter(b => !b.status || String(b.status) === 'active')
  const mainSlides = JSON.parse(JSON.stringify(activeSlides))

  const catIconRes = await prisma.categories.findMany({
    take: 4,
    orderBy: { priority: 'asc' }
  }).catch(() => [])

  const promoRes = await prisma.categories.findMany({
    take: 4,
    orderBy: { priority: 'asc' }
  }).catch(() => [])

  const rawRecProducts = await prisma.products.findMany({
    where: { status: 'active', is_recommended: true },
    take: 6
  }).catch(() => [])

  const recProducts = rawRecProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: Number(p.price ?? 0),
    image: p.image,
  }))

  const subtexts = ["Up to 50% Off!", "Bestsellers", "Latest Collection", "Limited Time Offer"];

  return (
    <div className="w-[92%] max-w-[1200px] mx-auto pb-10">
      
      {/* Dynamic Banner Slider */}
      <HomeSlider banners={mainSlides} />

      {/* Mega Offer Banner */}
      <div className="bg-gradient-to-br from-[#f85606] to-[#ff8c00] p-3 sm:p-[12px_25px] rounded-xl mt-[10px] flex justify-between items-center text-white">
        <div className="font-black text-[15px] sm:text-[18px] leading-tight">☀️ 4.4 MEGA SALE 🛍️</div>
        <Link href="/products" className="bg-white text-[#f85606] py-2 px-4 sm:py-[8px] sm:px-[25px] rounded-full font-black text-[12px] sm:text-[14px] shrink-0 ml-2">GRAB NOW ⚡</Link>
      </div>

      {/* SHOP BY CATEGORY */}
      <div className="flex items-center text-center my-6 sm:my-[30px] before:content-[''] before:flex-1 before:border-b-2 before:border-[#002b5b] after:content-[''] after:flex-1 after:border-b-2 after:border-[#002b5b]">
        <span className="px-3 sm:px-[20px] font-black text-[#002b5b] text-[14px] sm:text-[18px] uppercase whitespace-nowrap">Shop By Category</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-[15px] mb-6 sm:mb-[30px]">
        {catIconRes.map((c, idx) => {
          const colors = ['bg-[#0088cc]', 'bg-[#002b5b]', 'bg-[#333333]', 'bg-[#2e7d32]']
          return (
            <Link href={`/products?category=${c.id}`} key={c.id} className="bg-white rounded-xl overflow-hidden border border-[#ddd] shadow-[0_4px_15px_rgba(0,0,0,0.1)] flex flex-col hover:scale-[1.02] transition-transform active:scale-95">
              <div className="w-full h-[100px] sm:h-[180px] overflow-hidden">
                <img src={c.image ? `/admin_uploads/category/${c.image}` : "https://placehold.jp/300x200.png"} alt={c.name} className="w-full h-full object-cover block" />
              </div>
              <div className={`text-white p-[10px_5px] text-[12px] sm:text-[14px] font-black uppercase text-center ${colors[idx % 4]}`}>{c.name}</div>
            </Link>
          )
        })}
      </div>

      {/* SPECIAL OFFERS */}
      <div className="flex items-center text-center my-6 sm:my-[30px] before:content-[''] before:flex-1 before:border-b-2 before:border-[#002b5b] after:content-[''] after:flex-1 after:border-b-2 after:border-[#002b5b]">
        <span className="px-3 sm:px-[20px] font-black text-[#002b5b] text-[14px] sm:text-[18px] uppercase whitespace-nowrap">Special Offers</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-[15px] mb-8 sm:mb-[40px]">
        {Array.from({ length: 4 }).map((_, i) => {
          const p = promoRes[i]
          const name = p?.name || "Offer Title"
          const imgSrc = p?.banner ? `/admin_uploads/category/${p.banner}` : "https://placehold.jp/600x250.png"
          const linkId = p?.id || '#'
          return (
            <Link href={`/products?category=${linkId}`} key={i} className="relative rounded-[10px] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.1)] h-[120px] sm:h-[180px] block group active:scale-95 transition-transform">
              <img src={imgSrc} alt="Promo" className="w-full h-full object-cover block transition-transform group-hover:scale-105" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-center pl-4 sm:pl-[20px] text-white">
                <h2 className="m-0 text-[16px] sm:text-[22px] font-black uppercase leading-[1.1]">{name}</h2>
                <span className="mt-2 sm:mt-[10px] text-[10px] sm:text-[11px] font-bold bg-white text-black py-[3px] px-[10px] w-fit rounded uppercase">{subtexts[i]}</span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recommended Section */}
      <div className="mb-3 sm:mb-[20px] flex justify-between items-center">
        <h3 className="m-0 text-[15px] sm:text-[18px] font-bold text-[#002b5b]">Recommended For You 🎁</h3>
        <Link href="/products" className="text-[#f85606] text-[11px] sm:text-[12px] font-bold">VIEW ALL →</Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-[12px]">
        {recProducts.map(p => (
          <div key={p.id} className="bg-white rounded-xl overflow-hidden relative border border-[#f0f0f0] shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <Link href={`/product/${p.id}`} className="block flex-1">
              <div className="h-[130px] sm:h-[160px] flex items-center justify-center p-2 bg-gradient-to-b from-gray-50 to-white">
                <img src={p.image ? `/admin_uploads/products/${p.image}` : 'https://placehold.jp/300x300.png'} alt={p.name} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="p-2 sm:p-[10px]">
                <div className="text-[11px] sm:text-[12px] text-[#212121] h-[28px] sm:h-[32px] overflow-hidden mb-1 leading-tight">{p.name}</div>
                <div className="text-[14px] sm:text-[17px] text-[#f85606] font-extrabold block mb-1">৳{p.price.toLocaleString('en-BD')}</div>
              </div>
            </Link>
            <div className="px-2 pb-2 sm:px-[10px] sm:pb-[10px]">
              <button className="w-full bg-[#ffe1d2] text-[#f85606] border-none p-[7px] sm:p-[8px] text-[10px] sm:text-[11px] font-bold cursor-pointer rounded">ADD TO CART</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

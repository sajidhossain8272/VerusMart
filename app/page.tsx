import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import HomeSlider from '@/app/components/HomeSlider'

export default async function HomePage() {
  const rawSlides = await prisma.banners.findMany({
    where: { position: 'main', status: 'active' },
    orderBy: { id: 'desc' }
  }).catch(() => [])

  // Deep JSON serialization ensures zero non-plain objects, dates or Prisma symbols pass into Client Components
  const mainSlides = JSON.parse(JSON.stringify(rawSlides))

  const catIconRes = await prisma.categories.findMany({
    where: { id: { in: [13, 14, 15, 16] }, status: 'active' },
    orderBy: { id: 'asc' }
  }).catch(() => [])

  const promoRes = await prisma.categories.findMany({
    where: { id: { in: [17, 18, 19, 20] }, status: 'active' },
    orderBy: { id: 'asc' }
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
      <div className="bg-gradient-to-br from-[#f85606] to-[#ff8c00] p-[12px_25px] rounded-xl mt-[10px] flex justify-between items-center text-white">
        <div className="font-black text-[18px]">☀️ 4.4 MEGA SALE 🛍️</div>
        <Link href="/products" className="bg-white text-[#f85606] py-[8px] px-[25px] rounded-full font-black text-[14px]">GRAB NOW ⚡</Link>
      </div>

      {/* SHOP BY CATEGORY */}
      <div className="flex items-center text-center my-[30px] before:content-[''] before:flex-1 before:border-b-2 before:border-[#002b5b] after:content-[''] after:flex-1 after:border-b-2 after:border-[#002b5b]">
        <span className="px-[20px] font-black text-[#002b5b] text-[18px] uppercase">Shop By Category</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px] mb-[30px]">
        {catIconRes.map((c, idx) => {
          const colors = ['bg-[#0088cc]', 'bg-[#002b5b]', 'bg-[#333333]', 'bg-[#2e7d32]']
          return (
            <Link href={`/products?category=${c.id}`} key={c.id} className="bg-white rounded-xl overflow-hidden border border-[#ddd] shadow-[0_4px_15px_rgba(0,0,0,0.1)] flex flex-col hover:scale-[1.02] transition-transform">
              <div className="w-full h-[120px] md:h-[180px] overflow-hidden">
                <img src={c.image ? `/admin_uploads/category/${c.image}` : "https://placehold.jp/300x200.png"} alt={c.name} className="w-full h-full object-cover block" />
              </div>
              <div className={`text-white p-[12px_5px] text-[14px] font-black uppercase text-center ${colors[idx % 4]}`}>{c.name}</div>
            </Link>
          )
        })}
      </div>

      {/* SPECIAL OFFERS */}
      <div className="flex items-center text-center my-[30px] before:content-[''] before:flex-1 before:border-b-2 before:border-[#002b5b] after:content-[''] after:flex-1 after:border-b-2 after:border-[#002b5b]">
        <span className="px-[20px] font-black text-[#002b5b] text-[18px] uppercase">Special Offers</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mb-[40px]">
        {Array.from({ length: 4 }).map((_, i) => {
          const p = promoRes[i]
          const name = p?.name || "Offer Title"
          const imgSrc = p?.banner ? `/admin_uploads/category/${p.banner}` : "https://placehold.jp/600x250.png"
          const linkId = p?.id || '#'
          return (
            <Link href={`/products?category=${linkId}`} key={i} className="relative rounded-[10px] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.1)] h-[140px] md:h-[180px] block group">
              <img src={imgSrc} alt="Promo" className="w-full h-full object-cover block transition-transform group-hover:scale-105" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-center pl-[20px] text-white">
                <h2 className="m-0 text-[22px] font-black uppercase leading-[1.1]">{name}</h2>
                <span className="mt-[10px] text-[11px] font-bold bg-white text-black py-[3px] px-[10px] w-fit rounded uppercase">{subtexts[i]}</span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recommended Section */}
      <div className="mb-[20px] flex justify-between items-center">
        <h3 className="m-0 text-[18px] font-bold text-[#002b5b]">Recommended For You 🎁</h3>
        <Link href="/products" className="text-[#f85606] text-[12px] font-bold">VIEW ALL →</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-[12px]">
        {recProducts.map(p => (
          <div key={p.id} className="bg-white rounded overflow-hidden relative border border-[#f0f0f0]">
            <Link href={`/product/${p.id}`} className="block">
              <div className="h-[160px] flex items-center justify-center p-2">
                <img src={p.image ? `/admin_uploads/products/${p.image}` : 'https://placehold.jp/300x300.png'} alt={p.name} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="p-[10px]">
                <div className="text-[12px] text-[#212121] h-[32px] overflow-hidden mb-1">{p.name}</div>
                <div className="text-[17px] text-[#f85606] font-[#002b5b] font-extrabold block mb-2">৳{p.price.toLocaleString('en-BD')}</div>
              </div>
            </Link>
            <div className="px-[10px] pb-[10px]">
              <button className="w-full bg-[#ffe1d2] text-[#f85606] border-none p-[8px] text-[11px] font-bold cursor-pointer rounded">ADD TO CART</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

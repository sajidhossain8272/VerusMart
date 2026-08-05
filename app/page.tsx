import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import HomeSlider from './components/HomeSlider'
import AddToCartBtn from './products/AddToCartBtn'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [categories, banners, featuredProducts, recommendedProducts] = await Promise.all([
    prisma.categories.findMany({ where: { status: 'active' }, orderBy: { priority: 'asc' }, take: 8 }).catch(() => []),
    prisma.banners.findMany({ where: { status: 'active' }, orderBy: { id: 'desc' } }).catch(() => []),
    prisma.products.findMany({ where: { status: 'active', is_featured: true }, orderBy: { id: 'desc' }, take: 8 }).catch(() => []),
    prisma.products.findMany({ where: { status: 'active' }, orderBy: { created_at: 'desc' }, take: 12 }).catch(() => []),
  ])

  const formatTk = (num: number) => `৳${num.toLocaleString('en-BD')}`

  const serializedBanners = banners.map(b => ({
    id: b.id,
    title: b.title || '',
    image: b.image,
    position: b.position || 'main',
    status: b.status || 'active'
  }))

  return (
    <div className="w-[92%] max-w-[1240px] mx-auto py-6 sm:py-8 font-sans">
      
      {/* Banner Slider */}
      <HomeSlider banners={serializedBanners} />

      {/* Mega Sale Banner */}
      <div className="bg-gradient-to-br from-[#f85606] to-[#ff8c00] p-4 sm:p-6 rounded-2xl mt-4 flex flex-col sm:flex-row justify-between items-center text-white shadow-lg">
        <div>
          <div className="font-black text-lg sm:text-2xl leading-tight">☀️ VERUS MART MEGA DEALS 🛍️</div>
          <p className="text-xs sm:text-sm text-orange-100 mt-1">Get up to 50% discount on groceries, fruits, and electronics!</p>
        </div>
        <Link
          href="/products"
          className="bg-white text-[#f85606] py-2.5 px-6 rounded-full font-black text-xs sm:text-sm shrink-0 mt-3 sm:mt-0 shadow-md hover:bg-orange-50 transition-colors"
        >
          EXPLORE DEALS ⚡
        </Link>
      </div>

      {/* SHOP BY CATEGORY */}
      <div className="my-8">
        <div className="flex items-center text-center mb-6 before:content-[''] before:flex-1 before:border-b-2 before:border-[#002b5b] after:content-[''] after:flex-1 after:border-b-2 after:border-[#002b5b]">
          <span className="px-4 font-black text-[#002b5b] text-base sm:text-xl uppercase whitespace-nowrap">
            Shop By Category
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((c, idx) => {
            const colors = ['bg-[#0088cc]', 'bg-[#002b5b]', 'bg-[#333333]', 'bg-[#2e7d32]']
            return (
              <Link
                href={`/products?category=${c.id}`}
                key={c.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                <div className="w-full h-[120px] sm:h-[160px] overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                  <img
                    src={c.image ? `/admin_uploads/category/${c.image}` : "https://placehold.jp/300x200.png"}
                    alt={c.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className={`text-white p-3 text-xs sm:text-sm font-black uppercase text-center ${colors[idx % 4]}`}>
                  {c.name}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
            <h2 className="text-base sm:text-xl font-black text-[#002b5b] uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#f85606]">🔥</span> Featured Products
            </h2>
            <Link href="/products?type=hot" className="text-xs font-bold text-[#f85606] hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((p) => {
              const price = Number(p.price || 0)
              const oldPrice = Number(p.old_price || 0)
              const discount = oldPrice > price && oldPrice > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <Link href={`/product/${p.id}`} className="block bg-gray-50 p-4 relative">
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 bg-[#f85606] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        -{discount}%
                      </div>
                    )}
                    <div className="h-[160px] sm:h-[180px] w-full flex items-center justify-center">
                      <img
                        src={p.image ? `/admin_uploads/products/${p.image}` : 'https://placehold.jp/300x300.png'}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </Link>

                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <Link href={`/product/${p.id}`} className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 mb-2 block hover:text-[#f85606]">
                        {p.name}
                      </Link>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-sm sm:text-base font-black text-[#f85606]">{formatTk(price)}</span>
                        {discount > 0 && <span className="text-xs text-gray-400 line-through font-semibold">{formatTk(oldPrice)}</span>}
                      </div>
                      <AddToCartBtn product={{ id: p.id, name: p.name, price, image: p.image }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* RECOMMENDED FOR YOU */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
          <h2 className="text-base sm:text-xl font-black text-[#002b5b] uppercase tracking-wide flex items-center gap-2">
            <span>🎁</span> Recommended For You
          </h2>
          <Link href="/products" className="text-xs font-bold text-[#f85606] hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {recommendedProducts.map((p) => {
            const price = Number(p.price || 0)
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-lg transition-all p-3 flex flex-col justify-between"
              >
                <Link href={`/product/${p.id}`} className="block">
                  <div className="h-[120px] sm:h-[140px] flex items-center justify-center p-2 bg-gray-50 rounded-xl mb-2">
                    <img
                      src={p.image ? `/admin_uploads/products/${p.image}` : 'https://placehold.jp/300x300.png'}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xs font-bold text-gray-800 line-clamp-2 mb-1">{p.name}</h3>
                </Link>
                <div>
                  <div className="text-xs sm:text-sm font-black text-[#f85606] mb-2">{formatTk(price)}</div>
                  <AddToCartBtn product={{ id: p.id, name: p.name, price, image: p.image }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-sm mt-12">
        <h1 className="text-lg sm:text-2xl font-black text-[#002b5b] mb-4 uppercase tracking-tight">
          Verus Mart (VerusMart) — Premier Online Grocery & Shopping in Bangladesh
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
          Welcome to <strong>Verus Mart (verusmart.com)</strong>, your trusted destination for online grocery shopping, organic fruits, daily essentials, and consumer electronics in Bangladesh. Whether you search for <strong>VerusMart</strong>, <strong>Verus Mart</strong>, <strong>Verus</strong>, or <strong>Verus Mart BD</strong>, our mission is to deliver authentic products directly to your doorstep with unmatched speed and reliability.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
          <div>
            <h2 className="text-sm font-black text-[#002b5b] uppercase mb-2 flex items-center gap-2">
              <i className="fa-solid fa-apple-whole text-[#f85606]"></i> Fresh Groceries & Fruits
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              At <strong>Verus Mart</strong>, we source 100% fresh fruits, vegetables, dairy products, and daily groceries. Order online and get express home delivery inside Dhaka and all 64 districts across Bangladesh.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-black text-[#002b5b] uppercase mb-2 flex items-center gap-2">
              <i className="fa-solid fa-truck-fast text-[#f85606]"></i> Fast Cash on Delivery
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Shop with total confidence using Cash on Delivery (COD) at <strong>VerusMart</strong>. Track your orders live with your unique tracking reference number.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-black text-[#002b5b] uppercase mb-2 flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-[#f85606]"></i> 100% Genuine Quality
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every item sold on <strong>Verus Mart Bangladesh</strong> is quality inspected. Enjoy authentic brands, best market prices, and easy returns.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
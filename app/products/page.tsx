import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AddToCartBtn from './AddToCartBtn'
import SortDropdown from './SortDropdown'
import WishlistHeartBtn from '../components/WishlistHeartBtn'
import { getProductImageUrl } from '@/lib/utils'


export const dynamic = 'force-dynamic'
const PAGE_SIZE = 24

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; type?: string }>
}): Promise<Metadata> {
  const params = await searchParams
  const categoryId = params.category ? parseInt(params.category) : undefined
  const search = params.search?.trim() || ''
  const type = params.type || ''

  let title = 'All Products & Groceries | Verus Mart Bangladesh'
  let description = 'Browse our complete collection of authentic groceries, fresh produce, and home essentials with fast delivery in Bangladesh.'

  if (categoryId && !isNaN(categoryId)) {
    const cat = await prisma.categories.findUnique({ where: { id: categoryId } }).catch(() => null)
    if (cat) {
      title = `${cat.name} Online Shopping | Verus Mart Bangladesh`
      description = `Buy authentic ${cat.name} at the best price in Bangladesh. Fast home delivery and cash on delivery at Verus Mart.`
    }
  } else if (search) {
    title = `Search Results for "${search}" | Verus Mart Bangladesh`
    description = `Discover best deals and top products matching "${search}" at Verus Mart Bangladesh.`
  } else if (type === 'hot') {
    title = 'Hot Mega Deals & Special Offers | Verus Mart Bangladesh'
    description = 'Save big with hot deals and flash discounts on groceries, fruits, and electronics at Verus Mart.'
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://verusmart.com/products',
      siteName: 'Verus Mart',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; type?: string; sort?: string; page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page || '1'))
  const skip = (page - 1) * PAGE_SIZE
  const categoryId = params.category ? parseInt(params.category) : undefined
  const search = params.search?.trim() || ''
  const type = params.type || ''
  const sort = params.sort || 'newest'

  // Build where clause
  const where: Record<string, unknown> = {}
  if (categoryId && !isNaN(categoryId)) where.category_id = categoryId
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { meta_title: { contains: search, mode: 'insensitive' } },
      { meta_description: { contains: search, mode: 'insensitive' } },
      { unit: { contains: search, mode: 'insensitive' } },
      { category: { is: { name: { contains: search, mode: 'insensitive' } } } },
    ]
  }
  if (type === 'hot') where.is_featured = true
  if (type === 'weekly') where.is_weekday_deal = true
  if (type === 'trending') where.is_trending = true

  // Build orderBy
  type PrismaOrderBy = Record<string, 'asc' | 'desc'>
  const orderByMap: Record<string, PrismaOrderBy[]> = {
    newest: [{ created_at: 'desc' }, { id: 'desc' }],
    price_asc: [{ price: 'asc' }, { id: 'asc' }],
    price_desc: [{ price: 'desc' }, { id: 'desc' }],
  }
  const orderBy = orderByMap[sort] || orderByMap.newest

  const [rawProducts, total, rawCategories, selectedCat] = await Promise.all([
    prisma.products.findMany({ where, orderBy, skip, take: PAGE_SIZE }).catch(() => []),
    prisma.products.count({ where }).catch(() => 0),
    prisma.categories.findMany({ orderBy: { priority: 'asc' } }).catch(() => []),
    categoryId && !isNaN(categoryId) ? prisma.categories.findUnique({ where: { id: categoryId } }).catch(() => null) : Promise.resolve(null),
  ])

  const products = rawProducts.filter(p => !p.status || String(p.status) === 'active')
  const categories = rawCategories.filter(c => !c.status || String(c.status) === 'active')

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    const merged = { category: params.category, search: params.search, type: params.type, sort: params.sort, page: params.page, ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v) })
    return `/products?${p.toString()}`
  }

  const formatTk = (num: number) => {
    return `৳${num.toLocaleString('en-BD')}`
  }

  return (
    <div className="w-[92%] max-w-[1240px] mx-auto py-6 sm:py-8 font-sans">

      {/* Breadcrumb Navigation */}
      <nav className="text-xs sm:text-sm text-gray-500 mb-6 flex items-center gap-2 font-medium overflow-x-auto whitespace-nowrap">
        <Link href="/" className="text-gray-600 hover:text-[#f85606] transition-colors flex items-center gap-1">
          <i className="fa-solid fa-house text-[11px]"></i> Home
        </Link>
        <span className="text-gray-300">/</span>
        {selectedCat ? (
          <>
            <Link href="/products" className="text-gray-600 hover:text-[#f85606] transition-colors">Categories</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#002b5b] font-bold">{selectedCat.name}</span>
          </>
        ) : (
          <span className="text-[#002b5b] font-bold">All Products</span>
        )}
      </nav>

      {/* Mobile Horizontal Scrollable Category Selector */}
      <div className="lg:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Categories</span>
          {categoryId && (
            <Link href="/products" className="text-[11px] font-bold text-[#f85606] underline">Clear Filter</Link>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link
            href="/products"
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
              !categoryId
                ? 'bg-[#f85606] text-white shadow-orange-100'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-[#f85606]'
            }`}
          >
            All Products ({total})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildUrl({ category: cat.id.toString(), page: '1' })}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                categoryId === cat.id
                  ? 'bg-[#f85606] text-white shadow-orange-100'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#f85606]'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-[250px] shrink-0 sticky top-[100px]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
            <div className="bg-[#002b5b] text-white font-bold text-xs uppercase tracking-wider px-5 py-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-layer-group text-sm text-[#f85606]"></i> Categories
              </span>
              <span className="bg-[#001c3d] text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {categories.length}
              </span>
            </div>
            <ul className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              <li>
                <Link
                  href="/products"
                  className={`flex items-center justify-between px-5 py-3 text-xs font-bold transition-all ${
                    !categoryId
                      ? 'bg-[#fff6f2] text-[#f85606] border-l-4 border-[#f85606]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#f85606]'
                  }`}
                >
                  <span>All Products</span>
                  <i className="fa-solid fa-chevron-right text-[10px] opacity-40"></i>
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={buildUrl({ category: cat.id.toString(), page: '1' })}
                    className={`flex items-center justify-between px-5 py-3 text-xs font-bold transition-all ${
                      categoryId === cat.id
                        ? 'bg-[#fff6f2] text-[#f85606] border-l-4 border-[#f85606]'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#f85606]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <i className="fa-solid fa-chevron-right text-[10px] opacity-40"></i>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full">

          {/* Top Bar Header & Controls */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200/80 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-base sm:text-lg font-black text-[#002b5b] uppercase tracking-wide">
                {selectedCat ? selectedCat.name : 'ALL PRODUCTS'}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                {search && <span>Showing results for &ldquo;<strong className="text-gray-800">{search}</strong>&rdquo; — </span>}
                <strong className="text-[#f85606] font-extrabold">{total}</strong> items available in store
              </p>
            </div>

            {/* Sorting Dropdown */}
            <SortDropdown currentSort={sort} />
          </div>

          {/* Empty State */}
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200/80 my-8">
              <div className="w-16 h-16 bg-orange-50 text-[#f85606] rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">No matching products found</h2>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                We couldn't find any products matching your criteria. Try adjusting your filters or search keywords.
              </p>
              <Link
                href="/products"
                className="bg-[#002b5b] hover:bg-[#f85606] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md inline-block"
              >
                Browse Full Catalog
              </Link>
            </div>
          ) : (
            /* Product Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p) => {
                const price = Number(p.price ?? 0)
                const oldPrice = Number(p.old_price ?? 0)
                const discount = oldPrice > price && oldPrice > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group flex flex-col justify-between relative"
                  >
                    {/* Top Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 z-10 bg-[#f85606] text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-md tracking-wider">
                        -{discount}% OFF
                      </div>
                    )}

                    {/* Wishlist Heart Button */}
                    <WishlistHeartBtn productId={p.id} />
                    <Link href={`/product/${p.id}`} className="block relative bg-gradient-to-b from-[#f9fafb] to-[#f1f5f9] overflow-hidden">
                      <div className="h-[210px] sm:h-[250px] md:h-[270px] w-full p-4 flex items-center justify-center">
                        <img
                          src={getProductImageUrl(p.image)}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-108 transition-transform duration-500 ease-out"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://placehold.jp/300x300.png'
                          }}
                        />
                      </div>

                    </Link>

                    {/* Card Details Body */}
                    <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                      <div>
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1 mb-1.5">
                          <div className="flex text-amber-400 text-[10px] sm:text-xs">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold">(4.9)</span>
                        </div>

                        {/* Title */}
                        <Link
                          href={`/product/${p.id}`}
                          className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#f85606] transition-colors line-clamp-2 leading-snug mb-3 block"
                          title={p.name}
                        >
                          {p.name}
                        </Link>
                      </div>

                      {/* Price & Buying Action */}
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-base sm:text-lg font-black text-[#f85606]">
                            {formatTk(price)}
                          </span>
                          {discount > 0 && (
                            <span className="text-xs text-gray-400 line-through font-semibold">
                              {formatTk(oldPrice)}
                            </span>
                          )}
                        </div>

                        {/* Add To Cart CTA Button */}
                        <AddToCartBtn
                          product={{
                            id: p.id,
                            name: p.name,
                            price,
                            image: p.image ?? null,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
              {page > 1 && (
                <Link
                  href={buildUrl({ page: String(page - 1) })}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:border-[#f85606] hover:text-[#f85606] transition-colors shadow-sm"
                >
                  <i className="fa-solid fa-arrow-left mr-1"></i> Prev
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                  if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('...')
                  acc.push(n)
                  return acc
                }, [])
                .map((n, i) =>
                  n === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-3 py-2 text-xs text-gray-400 font-bold">
                      …
                    </span>
                  ) : (
                    <Link
                      key={n}
                      href={buildUrl({ page: String(n) })}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        page === n
                          ? 'bg-[#f85606] text-white shadow-md shadow-orange-100'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-[#f85606] hover:text-[#f85606]'
                      }`}
                    >
                      {n}
                    </Link>
                  )
                )}

              {page < totalPages && (
                <Link
                  href={buildUrl({ page: String(page + 1) })}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:border-[#f85606] hover:text-[#f85606] transition-colors shadow-sm"
                >
                  Next <i className="fa-solid fa-arrow-right ml-1"></i>
                </Link>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

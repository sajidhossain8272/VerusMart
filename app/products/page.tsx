import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AddToCartBtn from './AddToCartBtn'

const PAGE_SIZE = 24

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
  const where: Record<string, unknown> = { status: 'active' }
  if (categoryId && !isNaN(categoryId)) where.category_id = categoryId
  if (search) where.name = { contains: search, mode: 'insensitive' }
  if (type === 'hot') where.is_featured = true
  if (type === 'weekly') where.is_weekday_deal = true
  if (type === 'trending') where.is_trending = true

  // Build orderBy
  type PrismaOrderBy = { price?: 'asc' | 'desc'; created_at?: 'desc' }
  const orderByMap: Record<string, PrismaOrderBy> = {
    newest: { created_at: 'desc' },
    price_asc: { price: 'asc' },
    price_desc: { price: 'desc' },
  }
  const orderBy = orderByMap[sort] || orderByMap.newest

  const [products, total, categories, selectedCat] = await Promise.all([
    prisma.products.findMany({ where, orderBy, skip, take: PAGE_SIZE }),
    prisma.products.count({ where }),
    prisma.categories.findMany({ where: { status: 'active' }, orderBy: { priority: 'asc' } }),
    categoryId ? prisma.categories.findUnique({ where: { id: categoryId } }) : Promise.resolve(null),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    const merged = { category: params.category, search: params.search, type: params.type, sort: params.sort, page: params.page, ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v) })
    return `/products?${p.toString()}`
  }

  return (
    <div className="w-[92%] max-w-[1200px] mx-auto py-[20px]">

      {/* Breadcrumb */}
      <div className="text-[13px] text-[#757575] mb-[15px] font-medium">
        <Link href="/" className="text-[#1a9cb7] hover:underline">Home</Link>
        {' '}&gt;{' '}
        {selectedCat ? (
          <><Link href="/categories" className="text-[#1a9cb7] hover:underline">Categories</Link> &gt; <span className="text-[#212121]">{selectedCat.name}</span></>
        ) : (
          <span className="text-[#212121]">All Products</span>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-[20px] items-start">

        {/* Sidebar */}
        <aside className="w-full md:w-[220px] shrink-0">
          <div className="bg-white rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="bg-[#f85606] text-white font-bold text-[14px] px-[15px] py-[12px] uppercase tracking-[1px]">
              <i className="fa-solid fa-list-ul mr-[8px]"></i>Categories
            </div>
            <ul className="list-none">
              <li>
                <Link href="/products" className={`block px-[15px] py-[10px] text-[13px] border-b border-[#f5f5f5] transition-colors hover:bg-[#fff6f2] hover:text-[#f85606] ${!categoryId ? 'text-[#f85606] font-bold bg-[#fff6f2]' : 'text-[#333]'}`}>
                  All Products
                </Link>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link
                    href={buildUrl({ category: cat.id.toString(), page: '1' })}
                    className={`block px-[15px] py-[10px] text-[13px] border-b border-[#f5f5f5] transition-colors hover:bg-[#fff6f2] hover:text-[#f85606] ${categoryId === cat.id ? 'text-[#f85606] font-bold bg-[#fff6f2]' : 'text-[#333]'}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[10px] mb-[15px]">
            <div className="text-[14px] text-[#555]">
              {search && <span>Results for <strong>&ldquo;{search}&rdquo;</strong> — </span>}
              <strong>{total}</strong> product{total !== 1 ? 's' : ''} found
              {selectedCat && <span> in <strong>{selectedCat.name}</strong></span>}
            </div>
            <div className="flex items-center gap-[10px]">
              <label className="text-[13px] text-[#555] font-medium">Sort by:</label>
              <form method="GET" action="/products">
                {categoryId && <input type="hidden" name="category" value={categoryId} />}
                {search && <input type="hidden" name="search" value={search} />}
                {type && <input type="hidden" name="type" value={type} />}
                <select
                  name="sort"
                  defaultValue={sort}
                  onChange={undefined}
                  className="border border-[#ddd] rounded-[6px] px-[10px] py-[7px] text-[13px] bg-white outline-none cursor-pointer"
                  id="sort-select"
                  onChangeCapture={undefined}
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <noscript><button type="submit" className="ml-2 text-sm underline">Apply</button></noscript>
              </form>
            </div>
          </div>

          {/* Product grid */}
          {products.length === 0 ? (
            <div className="bg-white rounded-[12px] p-[60px] text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <div className="text-[48px] mb-[15px]">🔍</div>
              <h2 className="text-[20px] font-bold text-[#333] mb-[10px]">No products found</h2>
              <p className="text-[#888] mb-[20px]">Try a different search or browse all categories.</p>
              <Link href="/products" className="bg-[#f85606] text-white px-[25px] py-[10px] rounded-[6px] font-bold inline-block">Browse All</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[12px]">
              {products.map(p => {
                const price = Number(p.price ?? 0)
                const oldPrice = Number(p.old_price ?? 0)
                const discount = oldPrice > price && oldPrice > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0
                return (
                  <div key={p.id} className="bg-white rounded-[10px] overflow-hidden border border-[#f0f0f0] shadow-[0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.1)] transition-shadow group flex flex-col">
                    {discount > 0 && (
                      <span className="absolute z-10 top-[8px] left-[8px] bg-[#f85606] text-white text-[10px] font-bold px-[6px] py-[2px] rounded">-{discount}%</span>
                    )}
                    <Link href={`/product/${p.id}`} className="block relative">
                      <div className="h-[170px] flex items-center justify-center p-[10px] bg-white">
                        <img
                          src={p.image ? `/admin_uploads/products/${p.image}` : 'https://placehold.jp/300x300.png'}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <div className="px-[12px] pt-[8px] pb-[4px] flex flex-col flex-1">
                      <Link href={`/product/${p.id}`} className="text-[12px] text-[#212121] line-clamp-2 leading-[1.4] mb-[6px] hover:text-[#f85606] transition-colors">
                        {p.name}
                      </Link>
                      <div className="mt-auto">
                        <div className="flex items-baseline gap-[6px] mb-[8px]">
                          <span className="text-[16px] text-[#f85606] font-bold">${price.toFixed(2)}</span>
                          {discount > 0 && <span className="text-[11px] text-[#999] line-through">${oldPrice.toFixed(2)}</span>}
                        </div>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-[8px] mt-[30px] flex-wrap">
              {page > 1 && (
                <Link href={buildUrl({ page: String(page - 1) })} className="px-[14px] py-[8px] rounded-[6px] border border-[#ddd] text-[13px] font-medium hover:border-[#f85606] hover:text-[#f85606] transition-colors bg-white">
                  ← Prev
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                  if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('...')
                  acc.push(n)
                  return acc
                }, [])
                .map((n, i) =>
                  n === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-[14px] py-[8px] text-[13px] text-[#999]">…</span>
                  ) : (
                    <Link key={n} href={buildUrl({ page: String(n) })} className={`px-[14px] py-[8px] rounded-[6px] text-[13px] font-medium transition-colors ${page === n ? 'bg-[#f85606] text-white border border-[#f85606]' : 'bg-white border border-[#ddd] hover:border-[#f85606] hover:text-[#f85606]'}`}>
                      {n}
                    </Link>
                  )
                )}
              {page < totalPages && (
                <Link href={buildUrl({ page: String(page + 1) })} className="px-[14px] py-[8px] rounded-[6px] border border-[#ddd] text-[13px] font-medium hover:border-[#f85606] hover:text-[#f85606] transition-colors bg-white">
                  Next →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

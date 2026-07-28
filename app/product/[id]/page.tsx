import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import ProductActions from './ProductActions'
import AddToCartBtn from '@/app/products/AddToCartBtn'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const productId = parseInt(id)
  if (isNaN(productId)) return {}

  const product = await prisma.products.findUnique({ where: { id: productId } })
  if (!product) return {}

  const metaTitle = (product as any).meta_title || `${product.name} | Verus Mart`
  const cleanDesc = product.description?.replace(/<[^>]*>?/gm, '').trim() || ''
  const metaDesc = (product as any).meta_description || cleanDesc.substring(0, 160) || `Buy ${product.name} at Verus Mart Bangladesh with fast delivery.`
  const imageUrl = product.image ? `https://verusmart.com/admin_uploads/products/${product.image}` : 'https://verusmart.com/admin_uploads/logo.png'

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      images: [
        {
          url: imageUrl,
          alt: product.name,
        },
      ],
      siteName: 'Verus Mart',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: [imageUrl],
    },
  }
}

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const productId = parseInt(id)
  
  if (isNaN(productId)) {
    return notFound()
  }

  const product = await prisma.products.findUnique({
    where: { id: productId },
  })

  if (!product) {
    return notFound()
  }

  const cat = product.category_id ? await prisma.categories.findUnique({
    where: { id: product.category_id }
  }) : null

  const variants = await prisma.product_variants.findMany({
    where: { product_id: productId },
    orderBy: { id: 'asc' }
  })

  const related = await prisma.products.findMany({
    where: { 
      category_id: product.category_id ?? undefined, 
      id: { not: productId } 
    },
    take: 4
  })

  const defaultPrice = Number(product.price || variants[0]?.price || 0)
  const defaultOldPrice = Number(product.old_price || variants[0]?.old_price || 0)
  const defaultVName = variants[0]?.variant_name || 'Regular'

  // Clean script tags if present
  const cleanDescription = (product.description || '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Serialize variants for client component
  const serializedVariants = variants.map(v => ({
    id: v.id,
    variant_name: v.variant_name,
    price: Number(v.price),
    old_price: Number(v.old_price ?? 0),
  }))

  const formatTk = (num: number) => `৳${num.toLocaleString('en-BD')}`

  return (
    <div className="w-[92%] max-w-[1240px] mx-auto py-6 sm:py-8 font-sans">
      
      {/* Breadcrumb Bar */}
      <nav className="text-xs sm:text-sm text-gray-500 mb-6 flex items-center gap-2 font-medium overflow-x-auto whitespace-nowrap">
        <Link href="/" className="text-gray-600 hover:text-[#f85606] transition-colors flex items-center gap-1">
          <i className="fa-solid fa-house text-[11px]"></i> Home
        </Link>
        <span className="text-gray-300">/</span>
        {cat ? (
          <>
            <Link href={`/products?category=${cat.id}`} className="text-gray-600 hover:text-[#f85606] transition-colors">{cat.name}</Link>
            <span className="text-gray-300">/</span>
          </>
        ) : null}
        <span className="text-[#002b5b] font-bold truncate max-w-[300px]">{product.name}</span>
      </nav>

      {/* Main Product Details Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200/80 flex flex-col lg:flex-row gap-8 lg:gap-12 mb-8">
        <ProductActions
          product={{
            id: product.id,
            name: product.name,
            image: product.image ?? null,
            image_2: product.image_2 ?? null,
            image_3: product.image_3 ?? null,
            price: defaultPrice,
            old_price: defaultOldPrice,
          }}
          variants={serializedVariants}
          defaultPrice={defaultPrice}
          defaultOldPrice={defaultOldPrice}
          defaultVName={defaultVName}
        />
      </div>

      {/* Detailed Description Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm border border-gray-200/80">
        <div className="border-b border-gray-100 pb-4 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#fff6f2] text-[#f85606] rounded-xl flex items-center justify-center font-bold">
            <i className="fa-solid fa-align-left text-sm"></i>
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#002b5b] uppercase tracking-wide">
            Product Specifications & Details
          </h3>
        </div>
        <div className="text-gray-700 leading-relaxed text-sm prose max-w-none" dangerouslySetInnerHTML={{ __html: cleanDescription }}></div>
      </div>

      {/* Enhanced Recommended Products */}
      {related.length > 0 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200/80">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-base sm:text-lg font-black text-[#002b5b] uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#f85606]">🎁</span> You May Also Like
            </h3>
            <Link href="/products" className="text-xs font-bold text-[#f85606] hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => {
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
                    <div className="absolute top-3 left-3 z-10 bg-[#f85606] text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                      -{discount}% OFF
                    </div>
                  )}

                  {/* Image Container */}
                  <Link href={`/product/${p.id}`} className="block relative bg-gradient-to-b from-[#f9fafb] to-[#f1f5f9] overflow-hidden">
                    <div className="h-[200px] sm:h-[230px] w-full p-4 flex items-center justify-center">
                      <img
                        src={p.image ? `/admin_uploads/products/${p.image}` : 'https://placehold.jp/300x300.png'}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                    </div>
                  </Link>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5 text-amber-400 text-[10px]">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <Link
                        href={`/product/${p.id}`}
                        className="text-xs font-bold text-gray-900 group-hover:text-[#f85606] transition-colors line-clamp-2 leading-snug mb-2 block"
                      >
                        {p.name}
                      </Link>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-sm sm:text-base font-black text-[#f85606]">
                          {formatTk(price)}
                        </span>
                        {discount > 0 && (
                          <span className="text-xs text-gray-400 line-through font-semibold">
                            {formatTk(oldPrice)}
                          </span>
                        )}
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
        </div>
      )}

    </div>
  )
}

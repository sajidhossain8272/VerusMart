import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import ProductActions from './ProductActions'
import AddToCartBtn from '@/app/products/AddToCartBtn'
import ReviewSection from './ReviewSection'
import { getProductImageUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const productId = parseInt(id)
  if (isNaN(productId)) return {}

  const product = await prisma.products.findUnique({ where: { id: productId } }).catch(() => null)
  if (!product) return {}

  const metaTitle = (product as any).meta_title || `${product.name} | Verus Mart`
  const cleanDesc = product.description?.replace(/<[^>]*>?/gm, '').trim() || ''
  const metaDesc = (product as any).meta_description || cleanDesc.substring(0, 160) || `Buy ${product.name} at Verus Mart Bangladesh with fast delivery.`
  const imageUrl = getProductImageUrl(product.image)


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
  try {
    const { id } = await params
    const productId = parseInt(id)
    
    if (isNaN(productId)) {
      return notFound()
    }

    const product = await prisma.products.findUnique({
      where: { id: productId },
    }).catch(() => null)


    if (!product) {
      return notFound()
    }

    const [cat, variants, related, reviews] = await Promise.all([
      product.category_id ? prisma.categories.findUnique({ where: { id: product.category_id } }).catch(() => null) : Promise.resolve(null),
      prisma.product_variants.findMany({ where: { product_id: productId }, orderBy: { id: 'asc' } }).catch(() => []),
      prisma.products.findMany({ where: { category_id: product.category_id ?? undefined, id: { not: productId } }, take: 4 }).catch(() => []),
      prisma.reviews.findMany({ where: { product_id: productId, status: 'approved' }, include: { user: true }, orderBy: { id: 'desc' } }).catch(() => [])
    ])

    const defaultPrice = Number(product.price || variants[0]?.price || 0)
    const defaultOldPrice = Number(product.old_price || variants[0]?.old_price || 0)
    const defaultVName = variants[0]?.variant_name || 'Regular'

    const cleanDescription = (product.description || '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')

    const serializedVariants = (variants || []).map(v => ({
      id: v.id,
      variant_name: v.variant_name,
      price: Number(v.price),
      old_price: Number(v.old_price ?? 0),
    }))

    const serializedReviews = (reviews || []).map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
      user: r.user ? { full_name: r.user.full_name } : null
    }))

    const formatTk = (num: number) => `৳${num.toLocaleString('en-BD')}`

    return (
      <div className="w-[92%] max-w-[1240px] mx-auto py-6 sm:py-8 font-sans">
        
        {/* Breadcrumb Navigation */}
        <nav className="text-xs sm:text-sm text-gray-500 mb-6 flex items-center gap-2 font-medium overflow-x-auto whitespace-nowrap">
          <Link href="/" className="text-gray-600 hover:text-[#f85606] transition-colors flex items-center gap-1">
            <i className="fa-solid fa-house text-[11px]"></i> Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/products" className="text-gray-600 hover:text-[#f85606] transition-colors">
            Products
          </Link>
          {cat && (
            <>
              <span className="text-gray-300">/</span>
              <Link href={`/products?category=${cat.id}`} className="text-gray-600 hover:text-[#f85606] transition-colors">
                {cat.name}
              </Link>
            </>
          )}
          <span className="text-gray-300">/</span>
          <span className="text-[#002b5b] font-bold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-gray-200/80 mb-12">
          
          {/* Left Column: Gallery & Badges */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center relative overflow-hidden border border-gray-100 min-h-[300px] sm:min-h-[380px]">
              <img
                src={getProductImageUrl(product.image)}
                alt={product.name}
                className="max-h-[350px] w-auto max-w-full object-contain filter drop-shadow-md"
              />
            </div>
          </div>

          {/* Right Column: Product Info & Purchase Actions */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category Badge & Availability */}
              <div className="flex items-center justify-between gap-2 mb-3">
                {cat && (
                  <Link
                    href={`/products?category=${cat.id}`}
                    className="text-xs font-bold uppercase tracking-wider text-[#f85606] bg-orange-50 px-3 py-1 rounded-full hover:bg-orange-100 transition-colors"
                  >
                    {cat.name}
                  </Link>
                )}
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> In Stock
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating & Review Summary */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                <div className="flex text-amber-400 text-sm">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <span className="text-xs font-bold text-gray-500">
                  5.0 ({reviews.length} {reviews.length === 1 ? 'customer review' : 'customer reviews'})
                </span>
              </div>

              {/* Dynamic Interactive Client Actions (Price, Variant Selector, Quantity, Direct Buy, Add To Cart) */}
              <ProductActions
                product={{
                  id: product.id,
                  name: product.name,
                  image: product.image,
                  image_2: product.image_2,
                  image_3: product.image_3,
                  price: defaultPrice,
                  old_price: defaultOldPrice,
                }}
                variants={serializedVariants}
                defaultPrice={defaultPrice}
                defaultOldPrice={defaultOldPrice}
                defaultVName={defaultVName}
              />
            </div>

            {/* Delivery & Trust Highlights */}
            <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50">
                <i className="fa-solid fa-truck-fast text-[#f85606] text-base"></i>
                <div>
                  <div className="font-bold text-gray-900">Fast Delivery</div>
                  <div className="text-[11px] text-gray-400">Inside Dhaka & Nationwide</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50">
                <i className="fa-solid fa-shield-halved text-[#f85606] text-base"></i>
                <div>
                  <div className="font-bold text-gray-900">100% Genuine</div>
                  <div className="text-[11px] text-gray-400">Authentic Guarantee</div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Product Long Description & Specifications Section */}
        {cleanDescription && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200/80 mb-12">
            <h2 className="text-lg sm:text-xl font-black text-[#002b5b] uppercase tracking-wide mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
              <i className="fa-solid fa-circle-info text-[#f85606]"></i> Product Description & Details
            </h2>
            <div
              className="prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_strong]:text-gray-900"
              dangerouslySetInnerHTML={{ __html: cleanDescription }}
            />
          </div>
        )}

        {/* Customer Reviews Section */}
        <ReviewSection
          productId={product.id}
          initialReviews={serializedReviews}
        />

        {/* Related Products Grid */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
              <h2 className="text-base sm:text-xl font-black text-[#002b5b] uppercase tracking-wide flex items-center gap-2">
                <span>✨</span> Related Products You May Like
              </h2>
              <Link href={cat ? `/products?category=${cat.id}` : '/products'} className="text-xs font-bold text-[#f85606] hover:underline">
                View All in Category →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => {
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
                          src={getProductImageUrl(p.image)}
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
                          {discount > 0 && (
                            <span className="text-xs text-gray-400 line-through font-semibold">{formatTk(oldPrice)}</span>
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
  } catch (err) {
    console.error('Error in ProductDetails render:', err)
    return notFound()
  }
}

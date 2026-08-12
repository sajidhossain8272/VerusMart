'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/context/CartContext'

interface Variant {
  id: number
  variant_name: string
  price: number
  old_price: number
}

interface Props {
  product: {
    id: number
    name: string
    image: string | null
    image_2: string | null
    image_3: string | null
    price: number
    old_price: number
  }
  variants: Variant[]
  defaultPrice: number
  defaultOldPrice: number
  defaultVName: string
}

export default function ProductActions({ product, variants, defaultPrice, defaultOldPrice, defaultVName }: Props) {
  const router = useRouter()
  const { addToCart } = useCart()

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(variants.length > 0 ? variants[0] : null)
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(product.image ?? '')
  const [toast, setToast] = useState(false)

  const price = selectedVariant ? Number(selectedVariant.price) : defaultPrice
  const oldPrice = selectedVariant ? Number(selectedVariant.old_price) : defaultOldPrice
  const variantName = selectedVariant?.variant_name || defaultVName
  const discount = oldPrice > price && oldPrice > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price, image: product.image ?? null, variantName }, qty)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  const handleBuyNow = () => {
    addToCart({ id: product.id, name: product.name, price, image: product.image ?? null, variantName }, qty)
    router.push('/checkout')
  }

  const images = [product.image, product.image_2, product.image_3].filter(Boolean) as string[]

  return (
    <>
      {/* Toast Notification */}
      <div className={`fixed top-20 right-6 z-[9999] bg-[#001f40] text-white px-5 py-3.5 rounded-xl shadow-xl font-bold text-xs flex items-center gap-3 border border-[#003d80] transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="w-7 h-7 bg-[#f85606] rounded-full flex items-center justify-center text-white">
          <i className="fa-solid fa-check text-xs"></i>
        </div>
        <span>Item added to your shopping cart!</span>
      </div>

      {/* Image Gallery Column */}
      <div className="flex-1 lg:max-w-[45%] flex flex-col gap-4">
        <div className="w-full aspect-square border border-gray-200/80 rounded-2xl flex items-center justify-center p-6 bg-gradient-to-b from-[#f9fafb] to-[#f1f5f9] relative overflow-hidden shadow-sm">
          {discount > 0 && (
            <span className="absolute top-4 left-4 z-10 bg-[#f85606] text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
              -{discount}% OFF
            </span>
          )}
          <img
            src={activeImage ? `/admin_uploads/products/${activeImage}` : 'https://placehold.jp/500x500.png'}
            className="max-h-full max-w-full object-contain filter drop-shadow-md transition-all duration-300 hover:scale-105"
            alt={product.name}
          />
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 border-2 rounded-xl p-1.5 cursor-pointer bg-white transition-all overflow-hidden ${activeImage === img ? 'border-[#f85606] shadow-sm' : 'border-gray-200 opacity-70 hover:opacity-100'}`}
              >
                <img src={`/admin_uploads/products/${img}`} className="w-full h-full object-contain" alt={`Thumbnail ${idx + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details & Actions Column */}
      <div className="flex-[1.4] flex flex-col justify-between">
        <div>
          {/* Stock & Rating Header */}
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              In Stock & Ready to Ship
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <span className="text-gray-400 text-xs font-bold ml-1">(4.9)</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#002b5b] leading-snug mb-3">
            {product.name}
          </h1>

          {/* Pricing Banner */}
          <div className="bg-[#fff6f2] border border-orange-100 p-4 rounded-2xl mb-6 flex items-baseline gap-3">
            <span className="text-3xl font-black text-[#f85606]">
              ৳{price.toLocaleString('en-BD')}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through font-semibold">
                ৳{oldPrice.toLocaleString('en-BD')}
              </span>
            )}
          </div>

          {/* Variants Selector */}
          {variants.length > 0 && (
            <div className="mb-6">
              <label className="text-xs font-black text-[#002b5b] uppercase tracking-wider block mb-2.5">
                SELECT OPTION / SIZE:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                        isSelected
                          ? 'border-[#f85606] bg-[#f85606] text-white shadow-md font-black'
                          : 'border-gray-200 bg-white text-gray-800 hover:border-[#f85606] hover:text-[#f85606]'
                      }`}
                    >
                      {v.variant_name} — ৳{Number(v.price).toLocaleString('en-BD')}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              Quantity:
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl w-fit overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 bg-gray-100 text-gray-700 font-bold hover:bg-[#fff6f2] hover:text-[#f85606] transition-colors cursor-pointer"
              >
                −
              </button>
              <span className="px-5 text-sm font-extrabold text-[#002b5b] min-w-[40px] text-center">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 bg-gray-100 text-gray-700 font-bold hover:bg-[#fff6f2] hover:text-[#f85606] transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 px-6 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-white border-2 border-[#002b5b] text-[#002b5b] hover:bg-[#002b5b] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <i className="fa-solid fa-bag-shopping"></i> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 px-6 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-[#f85606] hover:bg-[#d04300] text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-orange-100"
            >
              <i className="fa-solid fa-[#002b5b] fa-bolt"></i> Buy Now (Cash On Delivery)
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 grid grid-cols-3 gap-2 text-center mt-4">
            <div className="flex flex-col items-center gap-1">
              <i className="fa-solid fa-[#002b5b] fa-shield-halved text-[#002b5b]"></i>
              <span className="text-[10px] font-bold text-gray-700">100% Authentic</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <i className="fa-solid fa-truck-fast text-[#f85606]"></i>
              <span className="text-[10px] font-bold text-gray-700">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <i className="fa-solid fa-money-bill-transfer text-emerald-600"></i>
              <span className="text-[10px] font-bold text-gray-700">Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

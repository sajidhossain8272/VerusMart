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
    router.push('/cart')
  }

  const images = [product.image, product.image_2, product.image_3].filter(Boolean) as string[]

  return (
    <>
      {/* Toast notification */}
      <div className={`fixed top-[80px] right-[20px] z-[9999] bg-[#10b981] text-white px-[20px] py-[14px] rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] font-bold text-[14px] flex items-center gap-[10px] transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-[10px] pointer-events-none'}`}>
        <i className="fa-solid fa-circle-check text-[18px]"></i>
        Item added to cart!
      </div>

      {/* Image gallery */}
      <div className="flex-1 md:max-w-[40%] flex flex-col gap-[15px]">
        <div className="w-full aspect-square border border-[#e0e0e0] rounded-[8px] flex items-center justify-center p-[10px] bg-[#fafafa]">
          <img
            src={activeImage ? `/admin_uploads/products/${activeImage}` : 'https://placehold.jp/500x500.png'}
            className="w-full h-full object-contain"
            alt={product.name}
          />
        </div>
        {images.length > 0 && (
          <div className="flex gap-[10px]">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-[80px] h-[80px] border rounded p-[5px] cursor-pointer transition-colors ${activeImage === img ? 'border-[#f85606]' : 'border-[#e0e0e0] hover:border-[#f85606]'}`}
              >
                <img src={`/admin_uploads/products/${img}`} className="w-full h-full object-contain" alt={`View ${idx + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex-[1.5]">
        <h1 className="text-[22px] font-black text-[#212121] leading-[1.3] mb-[15px]">{product.name}</h1>
        <div className="text-[14px] text-[#1a9cb7] mb-[20px] font-medium">Brand: No Brand</div>

        <hr className="border-[#f1f1f1] my-[20px]" />

        {/* Price */}
        <div className="mb-[20px]">
          <div className="text-[32px] text-[#f85606] font-black leading-[1]">${price.toFixed(2)}</div>
          {discount > 0 && (
            <div className="text-[14px] text-[#9e9e9e] line-through mt-[5px] font-medium">
              ${oldPrice.toFixed(2)}
              <span className="text-[#212121] ml-[10px] bg-[#ffe1d2] p-[2px_6px] rounded text-[12px] font-bold no-underline">
                -{discount}%
              </span>
            </div>
          )}
        </div>

        {/* Variants */}
        {variants.length > 0 && (
          <>
            <hr className="border-[#f1f1f1] my-[15px]" />
            <div className="mb-[15px]">
              <div className="text-[13px] font-bold text-[#444] mb-[10px] uppercase tracking-[0.5px]">Variant:</div>
              <div className="flex flex-wrap gap-[8px]">
                {variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-[14px] py-[7px] rounded-[6px] text-[13px] font-bold border-2 transition-all cursor-pointer ${selectedVariant?.id === v.id ? 'border-[#f85606] bg-[#fff6f2] text-[#f85606]' : 'border-[#ddd] bg-white text-[#444] hover:border-[#f85606]'}`}
                  >
                    {v.variant_name} — ${Number(v.price).toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <hr className="border-[#f1f1f1] my-[15px]" />

        {/* Quantity */}
        <div className="mb-[20px]">
          <div className="text-[13px] font-bold text-[#444] mb-[10px] uppercase tracking-[0.5px]">Quantity:</div>
          <div className="flex items-center gap-0 border border-[#ddd] rounded-[8px] w-fit overflow-hidden">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-[40px] h-[42px] bg-[#f5f5f5] border-none text-[18px] font-bold cursor-pointer hover:bg-[#ffe1d2] hover:text-[#f85606] transition-colors"
            >
              −
            </button>
            <span className="px-[20px] text-[16px] font-bold text-[#212121] min-w-[50px] text-center">{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              className="w-[40px] h-[42px] bg-[#f5f5f5] border-none text-[18px] font-bold cursor-pointer hover:bg-[#ffe1d2] hover:text-[#f85606] transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-[15px] flex-col md:flex-row">
          <button
            onClick={handleBuyNow}
            className="flex-1 p-[15px] text-[15px] font-bold uppercase rounded-[8px] cursor-pointer border-none bg-[#2fc5f1] text-white hover:bg-[#1a9cb7] transition-colors"
          >
            Buy Now
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 p-[15px] text-[15px] font-bold uppercase rounded-[8px] cursor-pointer border-none bg-[#f85606] text-white hover:bg-[#d04000] transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  )
}

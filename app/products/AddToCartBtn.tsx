'use client'

import { useCart } from '@/app/context/CartContext'
import { useState } from 'react'

interface Props {
  product: {
    id: number
    name: string
    price: number
    image: string | null
    variantName?: string
  }
}

export default function AddToCartBtn({ product }: Props) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image ?? null, variantName: product.variantName })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full py-2.5 px-3 text-xs font-bold uppercase tracking-wider cursor-pointer rounded-xl border-none transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
        added
          ? 'bg-[#10b981] text-white shadow-green-200'
          : 'bg-[#f85606] hover:bg-[#d04300] text-white shadow-orange-100 hover:shadow-md'
      }`}
    >
      {added ? (
        <>
          <i className="fa-solid fa-check text-xs"></i> ADDED TO BAG
        </>
      ) : (
        <>
          <i className="fa-solid fa-bag-shopping text-xs"></i> ADD TO CART
        </>
      )}
    </button>
  )
}

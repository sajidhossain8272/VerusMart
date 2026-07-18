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
      className={`w-full py-[8px] text-[11px] font-bold cursor-pointer rounded-[4px] border-none transition-all duration-200 ${added ? 'bg-[#10b981] text-white' : 'bg-[#ffe1d2] text-[#f85606] hover:bg-[#f85606] hover:text-white'}`}
    >
      {added ? '✓ ADDED' : 'ADD TO CART'}
    </button>
  )
}

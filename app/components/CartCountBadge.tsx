'use client'

import { useCart } from '@/app/context/CartContext'

export default function CartCountBadge() {
  const { cartCount } = useCart()

  return (
    <span className="absolute -top-[8px] -right-[10px] bg-[#f85606] text-white text-[10px] px-[6px] py-[2px] rounded-full font-bold min-w-[18px] text-center leading-[14px]">
      {cartCount > 99 ? '99+' : cartCount}
    </span>
  )
}

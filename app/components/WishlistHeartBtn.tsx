'use client'

import { useState } from 'react'
import { useWishlist } from '../context/WishlistContext'
import { useRouter } from 'next/navigation'

interface WishlistHeartBtnProps {
  productId: number
}

export default function WishlistHeartBtn({ productId }: WishlistHeartBtnProps) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const router = useRouter()

  const wishlisted = isWishlisted(productId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return

    setLoading(true)
    const result = await toggleWishlist(productId)
    setLoading(false)

    if (result.requiresLogin) {
      router.push(`/login?redirect=/wishlist`)
      return
    }

    if (result.success) {
      setToast(result.message || (result.added ? 'Added to wishlist!' : 'Removed from wishlist'))
      setTimeout(() => setToast(null), 2200)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        className={`absolute top-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
          wishlisted
            ? 'bg-[#f85606] text-white scale-110'
            : 'bg-white text-gray-400 hover:text-[#f85606] hover:bg-[#fff0ea] hover:scale-110'
        } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <i className="fa-solid fa-spinner fa-spin text-[11px]"></i>
        ) : (
          <i className={`${wishlisted ? 'fa-solid' : 'fa-regular'} fa-heart text-[13px]`}></i>
        )}
      </button>

      {/* Micro-toast notification */}
      {toast && (
        <div className="absolute top-11 right-2 z-30 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap animate-fadeIn pointer-events-none">
          {toast}
        </div>
      )}
    </>
  )
}

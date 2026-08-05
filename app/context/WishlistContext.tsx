'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface WishlistContextType {
  wishlistIds: number[]
  isWishlisted: (productId: number) => boolean
  toggleWishlist: (productId: number) => Promise<{ success: boolean; added?: boolean; requiresLogin?: boolean; message?: string }>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<number[]>([])

  useEffect(() => {
    // Initial fetch from DB
    fetch('/api/wishlist')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && Array.isArray(data.items)) {
          const ids = data.items.map((item: any) => item.product_id)
          setWishlistIds(ids)
        } else {
          // Guest fallback in localStorage
          try {
            const saved = localStorage.getItem('verusmart_wishlist')
            if (saved) setWishlistIds(JSON.parse(saved))
          } catch {}
        }
      })
      .catch(() => {})
  }, [])

  const isWishlisted = (productId: number) => wishlistIds.includes(productId)

  const toggleWishlist = async (productId: number) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      const data = await res.json()

      if (res.status === 401 || data.requiresLogin) {
        // Handle guest local toggle
        let updated: number[] = []
        if (wishlistIds.includes(productId)) {
          updated = wishlistIds.filter(id => id !== productId)
        } else {
          updated = [...wishlistIds, productId]
        }
        setWishlistIds(updated)
        try {
          localStorage.setItem('verusmart_wishlist', JSON.stringify(updated))
        } catch {}
        return { success: true, added: updated.includes(productId), message: 'Saved to local wishlist' }
      }

      if (data.success) {
        if (data.added) {
          setWishlistIds(prev => Array.from(new Set([...prev, productId])))
        } else {
          setWishlistIds(prev => prev.filter(id => id !== productId))
        }
        return { success: true, added: data.added, message: data.message }
      }

      return { success: false, message: data.error || 'Failed' }
    } catch {
      return { success: false, message: 'Network error' }
    }
  }

  return (
    <WishlistContext.Provider value={{ wishlistIds, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface CartItem {
  id: number
  name: string
  price: number
  image: string | null
  variantName?: string
  quantity: number
}

interface CartContextValue {
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  removeFromCart: (id: number, variantName?: string) => void
  updateQty: (id: number, variantName: string | undefined, qty: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'verusmart_cart'

function makeKey(id: number, variantName?: string) {
  return `${id}__${variantName ?? ''}`
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setCartItems(JSON.parse(raw))
    } catch { /* ignore */ }
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    } catch { /* ignore */ }
  }, [cartItems])

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, qty = 1) => {
    setCartItems(prev => {
      const key = makeKey(item.id, item.variantName)
      const idx = prev.findIndex(ci => makeKey(ci.id, ci.variantName) === key)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + qty }
        return updated
      }
      return [...prev, { ...item, quantity: qty }]
    })
  }, [])

  const removeFromCart = useCallback((id: number, variantName?: string) => {
    const key = makeKey(id, variantName)
    setCartItems(prev => prev.filter(ci => makeKey(ci.id, ci.variantName) !== key))
  }, [])

  const updateQty = useCallback((id: number, variantName: string | undefined, qty: number) => {
    if (qty < 1) return
    const key = makeKey(id, variantName)
    setCartItems(prev =>
      prev.map(ci => makeKey(ci.id, ci.variantName) === key ? { ...ci, quantity: qty } : ci)
    )
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

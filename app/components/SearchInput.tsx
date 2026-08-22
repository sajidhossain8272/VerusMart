'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getProductImageUrl } from '@/lib/utils'


interface ProductResult {
  id: number
  name: string
  price: number
  old_price?: number
  image: string | null
  unit?: string | null
}

interface CategoryResult {
  id: number
  name: string
  image: string | null
}

export default function SearchInput() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ products: ProductResult[]; categories: CategoryResult[] }>({
    products: [],
    categories: [],
  })
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounced search fetch
  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setResults({ products: [], categories: [] })
      setIsOpen(false)
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
        .then(res => res.json())
        .then(data => {
          setResults({
            products: data.products || [],
            categories: data.categories || [],
          })
          setIsOpen(true)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    setIsOpen(false)
    router.push(`/products?search=${encodeURIComponent(trimmed)}`)
  }

  const formatTk = (num: number) => `৳${num.toLocaleString('en-BD')}`

  return (
    <div ref={containerRef} className="flex-1 relative">
      <form onSubmit={handleSubmit} className="w-full flex relative">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => {
            if (results.products.length > 0 || results.categories.length > 0) setIsOpen(true)
          }}
          placeholder="Search in Verus Mart (groceries, fruits, perfumes...)"
          className="w-full py-3 pl-5 pr-14 bg-[#eff0f5] border border-transparent rounded-2xl outline-none text-xs sm:text-sm font-medium text-gray-900 transition-all focus:bg-white focus:border-[#f85606] focus:ring-2 focus:ring-orange-500/10 shadow-inner"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-full w-12 bg-[#f85606] hover:bg-[#d04300] text-white border-none rounded-r-2xl cursor-pointer transition-colors flex items-center justify-center shadow-md active:scale-95"
          title="Search"
        >
          {loading ? (
            <i className="fa-solid fa-spinner fa-spin text-xs"></i>
          ) : (
            <i className="fa-solid fa-search text-xs"></i>
          )}
        </button>
      </form>

      {/* Live Autosuggest Dropdown Overlay */}
      {isOpen && (results.products.length > 0 || results.categories.length > 0) && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1100] transition-all animate-fadeIn">
          
          {/* Category Matches */}
          {results.categories.length > 0 && (
            <div className="p-3 bg-gray-50 border-b border-gray-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Categories</p>
              <div className="flex flex-wrap gap-2">
                {results.categories.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.id}`}
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 bg-white rounded-xl text-xs font-bold text-[#002b5b] hover:bg-[#f85606] hover:text-white transition-colors border border-gray-200 shadow-sm flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-tag text-[10px]"></i>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Product Matches */}
          {results.products.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 p-3 pb-1">Products</p>
              <div className="divide-y divide-gray-100 max-h-[360px] overflow-y-auto">
                {results.products.map(product => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-orange-50/60 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 p-1 flex items-center justify-center">
                      <img
                        src={getProductImageUrl(product.image)}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://placehold.jp/100x100.png'
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#f85606] transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        {product.unit || 'In Stock'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-[#f85606]">
                        {formatTk(product.price)}
                      </span>
                      {product.old_price && product.old_price > product.price ? (
                        <span className="block text-[10px] text-gray-400 line-through font-semibold">
                          {formatTk(product.old_price)}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* View All Search Results Link */}
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
            <Link
              href={`/products?search=${encodeURIComponent(query.trim())}`}
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-[#f85606] hover:underline flex items-center justify-center gap-1.5"
            >
              See all results for &ldquo;{query.trim()}&rdquo; →
            </Link>
          </div>

        </div>
      )}

    </div>
  )
}

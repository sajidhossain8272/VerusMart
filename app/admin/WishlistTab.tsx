'use client'

import { useEffect, useState } from 'react'
import { formatDate, getProductImageUrl } from '@/lib/utils'

interface WishlistProduct {
  id: number
  name: string
  price: number
  image: string | null
}

interface WishlistEntry {
  id: number
  product_id: number
  user_id: number
  created_at: string | null
  user: { full_name: string; email: string } | null
  product: WishlistProduct | null
}

interface WishlistStats {
  totalWishlisted: number
  topProducts: { productId: number; name: string; image: string | null; count: number }[]
  entries: WishlistEntry[]
}

export default function WishlistTab() {
  const [data, setData] = useState<WishlistStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/wishlist-stats')
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load wishlist data.')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-[#f85606]"></i>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 text-xs font-bold">
        {error}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-8">

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Total Wishlisted Items</span>
          <div className="text-2xl font-black text-[#f85606] mt-2">{data.totalWishlisted}</div>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Unique Products Wishlisted</span>
          <div className="text-2xl font-black text-[#002b5b] mt-2">{data.topProducts.length}</div>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Most Desired Product</span>
          <div className="text-sm font-black text-green-700 mt-2 truncate">
            {data.topProducts[0]?.name || '—'}
          </div>
        </div>
      </div>

      {/* Top Wishlisted Products */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 bg-[#001f40] text-white">
          <h2 className="font-black text-sm uppercase tracking-wider">🔥 Top Wishlisted Products</h2>
          <p className="text-[10px] text-blue-200 mt-0.5">Products customers want the most — great for promotions and restock prioritization</p>
        </div>
        {data.topProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400 font-bold">No wishlist data yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.topProducts.map((prod, idx) => (
              <div key={prod.productId} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <span className="text-xs font-black text-gray-400 w-6 shrink-0 text-right">#{idx + 1}</span>
                <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={getProductImageUrl(prod.image)}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://placehold.jp/100x100.png'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                  <p className="text-[10px] text-gray-400">Product ID: {prod.productId}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="bg-red-50 text-[#f85606] text-xs font-black px-3 py-1 rounded-full border border-red-100 flex items-center gap-1">
                    <i className="fa-solid fa-heart text-[10px]"></i> {prod.count} {prod.count === 1 ? 'save' : 'saves'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Wishlist Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 bg-[#001f40] text-white">
          <h2 className="font-black text-sm uppercase tracking-wider">📋 All Wishlist Entries</h2>
          <p className="text-[10px] text-blue-200 mt-0.5">Complete log of customer wishlist saves for retargeting and analysis</p>
        </div>
        {data.entries.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400 font-bold">No wishlist entries yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left font-black text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="p-4 text-left font-black text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="p-4 text-left font-black text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="p-4 text-left font-black text-gray-500 uppercase tracking-wider">Saved On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.entries.map(entry => (
                  <tr key={entry.id} className="hover:bg-orange-50/40 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{entry.user?.full_name || '—'}</td>
                    <td className="p-4 text-gray-500">{entry.user?.email || '—'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {entry.product?.image && (
                          <img
                            src={getProductImageUrl(entry.product.image)}
                            className="w-8 h-8 object-contain rounded-lg bg-gray-50 border border-gray-100 p-0.5"
                            alt={entry.product?.name}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://placehold.jp/100x100.png'
                            }}
                          />
                        )}
                        <span className="font-bold text-gray-800 truncate max-w-[200px]">{entry.product?.name || '—'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">
                      {entry.created_at ? formatDate(entry.created_at) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


    </div>
  )
}

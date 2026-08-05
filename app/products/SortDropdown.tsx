'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function SortDropdown({ currentSort }: { currentSort: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', e.target.value)
    params.set('page', '1') // Reset to page 1 when changing sort order
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 self-end sm:self-auto">
      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider hidden sm:inline">
        Sort By:
      </span>
      <select
        value={currentSort}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#f85606] cursor-pointer shadow-sm hover:border-[#f85606] transition-colors"
      >
        <option value="newest">Newest Arrivals</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  )
}

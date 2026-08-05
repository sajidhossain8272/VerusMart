'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Cat { id: number; name: string }

export default function MobileMenuClient({ categories }: { categories: Cat[] }) {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{ full_name?: string; email?: string } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="p-3 text-[22px] text-[#444] cursor-pointer bg-transparent border-none"
        aria-label="Open menu"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[1099] bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-white z-[1100] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="bg-[#002b5b] px-5 py-4 flex items-center justify-between shrink-0">
          <img src="/admin_uploads/logo.png" alt="VerusMart" className="h-7 w-auto object-contain filter brightness-0 invert" />
          <button
            onClick={() => setOpen(false)}
            className="text-white text-xl bg-transparent border-none cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Search */}
        <form action="/products" method="GET" className="px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="relative flex">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              className="w-full py-2.5 pl-4 pr-10 bg-gray-100 rounded-xl text-sm outline-none border-2 border-transparent focus:border-[#f85606] transition-colors"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#f85606] bg-transparent border-none cursor-pointer">
              <i className="fa-solid fa-search text-sm"></i>
            </button>
          </div>
        </form>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto">
          <div className="px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Browse</p>
            {[
              { href: '/', icon: 'fa-house', label: 'Home' },
              { href: '/products', icon: 'fa-border-all', label: 'All Products' },
              { href: '/products?type=hot', icon: 'fa-fire', label: 'Hot Deals' },
              { href: '/products?type=weekly', icon: 'fa-bolt', label: 'Weekly Deals' },
              { href: '/account', icon: 'fa-user-gear', label: 'My Account' },
              { href: '/track-order', icon: 'fa-truck-fast', label: 'Track Order' },
              { href: '/serving-area', icon: 'fa-location-dot', label: 'Serving Area' },
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:bg-orange-50 hover:text-[#f85606] transition-colors"
              >
                <i className={`fa-solid ${l.icon} w-4 text-[#f85606]`}></i>
                {l.label}
              </Link>
            ))}
          </div>

          {categories.length > 0 && (
            <div className="px-4 pb-3 border-t border-gray-100 pt-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Categories</p>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-[#f85606] transition-colors"
                >
                  <span>{cat.name}</span>
                  <i className="fa-solid fa-chevron-right text-[10px] opacity-40"></i>
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Footer actions */}
        <div className="shrink-0 border-t border-gray-100 px-4 py-4 flex gap-3">
          {user ? (
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="w-full text-center py-3 rounded-xl bg-[#002b5b] text-white text-xs font-black uppercase tracking-wider hover:bg-[#f85606] transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-user-check"></i> My Account ({user.full_name?.split(' ')[0]})
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl border-2 border-[#002b5b] text-[#002b5b] text-xs font-black uppercase tracking-wider hover:bg-[#002b5b] hover:text-white transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl bg-[#f85606] text-white text-xs font-black uppercase tracking-wider hover:bg-[#d04300] transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  )
}

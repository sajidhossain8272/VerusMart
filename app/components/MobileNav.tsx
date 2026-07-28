'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/app/context/CartContext'

export default function MobileNav() {
  const pathname = usePathname()
  const { cartCount } = useCart()

  const links = [
    { href: '/', icon: 'fa-house', label: 'Home' },
    { href: '/products', icon: 'fa-border-all', label: 'Shop' },
    { href: '/cart', icon: 'fa-cart-shopping', label: 'Cart', badge: cartCount },
    { href: '/account', icon: 'fa-user', label: 'Account' },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[1100] bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-4">
        {links.map(link => {
          const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center py-2.5 gap-1 relative transition-colors ${active ? 'text-[#f85606]' : 'text-gray-500 hover:text-[#f85606]'}`}
            >
              <div className="relative">
                <i className={`fa-solid ${link.icon} text-[18px]`}></i>
                {link.badge ? (
                  <span className="absolute -top-2 -right-2.5 bg-[#f85606] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {link.badge > 9 ? '9+' : link.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] font-bold ${active ? 'text-[#f85606]' : 'text-gray-500'}`}>{link.label}</span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#f85606] rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

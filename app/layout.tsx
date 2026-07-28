import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { CartProvider } from './context/CartContext'

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'Verus Mart',
  description: 'Verus Mart E-Commerce',
}

import { headers } from 'next/headers'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerList = await headers()
  const pathname = headerList.get('x-pathname') || ''
  const host = headerList.get('host') || ''

  const isAdmin = pathname.startsWith('/admin') || host.startsWith('admin.verusmart.com') || host.startsWith('admin.localhost')

  if (isAdmin) {
    return (
      <html lang="en">
        <head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </head>
        <body className={roboto.variable}>
          <CartProvider>
            <main className="min-h-screen bg-[#eff0f5]">{children}</main>
          </CartProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={roboto.variable}>
        <CartProvider>
          <Header />
          <main className="min-h-screen bg-[#eff0f5] flow-root">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}

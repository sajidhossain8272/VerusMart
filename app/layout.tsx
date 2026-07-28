import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { CartProvider } from './context/CartContext'
import { headers } from 'next/headers'

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'Verus Mart - Online Shopping in Bangladesh',
  description: 'Shop authentic products with fast delivery and cash on delivery at Verus Mart Bangladesh.',
  verification: {
    google: '23w6Aq7mtz8WzfF9RyqAIv9zaQ6ou3yxDiwV_XEeC4U',
  },
}

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
          <meta name="google-site-verification" content="23w6Aq7mtz8WzfF9RyqAIv9zaQ6ou3yxDiwV_XEeC4U" />
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
        <meta name="google-site-verification" content="23w6Aq7mtz8WzfF9RyqAIv9zaQ6ou3yxDiwV_XEeC4U" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={roboto.variable}>
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-01JZ2L20C3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-01JZ2L20C3');
          `}
        </Script>

        <CartProvider>
          <Header />
          <main className="min-h-screen bg-[#eff0f5] flow-root">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}

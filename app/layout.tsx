import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import MobileNav from './components/MobileNav'
import { CartProvider } from './context/CartContext'
import { headers } from 'next/headers'

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

const baseUrl = 'https://verusmart.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Verus Mart - Online Shopping & Grocery Delivery in Bangladesh | verusmart.com',
    template: '%s | Verus Mart Bangladesh',
  },
  description: 'Shop authentic fresh groceries, organic fruits, daily essentials, and electronics with fast delivery and cash on delivery at Verus Mart Bangladesh (verusmart.com).',
  keywords: [
    'verusmart',
    'verus mart',
    'verus',
    'verusmart bd',
    'verus mart bangladesh',
    'verus market',
    'verus store',
    'verus online',
    'verus mart online shopping',
    'verus mart dhaka',
    'verusmart.com',
    'online shopping in bangladesh',
    'online grocery store dhaka',
    'buy fresh fruits online dhaka',
    'best online shopping site in bd',
    'cash on delivery shopping bd',
    'fresh vegetables home delivery',
    'online super shop bangladesh',
    'grocery delivery dhaka'
  ],
  authors: [{ name: 'Verus Mart Bangladesh', url: baseUrl }],
  creator: 'Verus Mart',
  publisher: 'Verus Mart',
  icons: {
    icon: '/admin_uploads/logo.png',
    apple: '/admin_uploads/logo.png',
  },
  appleWebApp: {
    title: 'VerusMart',
    statusBarStyle: 'default',
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Verus Mart Bangladesh',
    title: 'Verus Mart (verusmart.com) - Online Shopping & Grocery Delivery in Bangladesh',
    description: 'Verus Mart is Bangladesh\'s leading online super shop. Order fresh groceries, organic fruits, and daily essentials with cash on delivery.',
    images: [
      {
        url: `${baseUrl}/admin_uploads/logo.png`,
        width: 800,
        height: 600,
        alt: 'Verus Mart Bangladesh Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verus Mart - Online Shopping in Bangladesh (verusmart.com)',
    description: 'Shop authentic products with fast delivery and cash on delivery at Verus Mart Bangladesh.',
    images: [`${baseUrl}/admin_uploads/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let isAdmin = false
  try {
    const headerList = await headers()
    const pathname = headerList.get('x-pathname') || ''
    const host = headerList.get('host') || ''
    isAdmin = pathname.startsWith('/admin') || host.startsWith('admin.verusmart.com') || host.startsWith('admin.localhost')
  } catch {
    isAdmin = false
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Verus Mart',
    alternateName: ['verusmart', 'verus', 'verus mart', 'verusmart bd', 'verus mart bangladesh', 'verus market', 'verus store', 'verus online'],
    url: baseUrl,
    logo: `${baseUrl}/admin_uploads/logo.png`,
    sameAs: [
      'https://www.facebook.com/verusmartbd',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+8801628083370',
      contactType: 'customer service',
      areaServed: 'BD',
      availableLanguage: ['en', 'bn'],
    },
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Verus Mart',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="VerusMart" />
        <link rel="icon" href="/admin_uploads/logo.png" />
        <link rel="apple-touch-icon" href="/admin_uploads/logo.png" />

        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M4WDWDWX');`,
          }}
        />

        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1004819899041313');
fbq('track', 'PageView');`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1004819899041313&ev=PageView&noscript=1"
            alt="Meta Pixel"
          />
        </noscript>

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

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={roboto.variable}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M4WDWDWX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <CartProvider>
          {isAdmin ? (
            <main className="min-h-screen bg-[#eff0f5]">{children}</main>
          ) : (
            <>
              <Header />
              <main className="min-h-screen bg-[#eff0f5] flow-root pb-16 lg:pb-0">{children}</main>
              <Footer />
              <MobileNav />
            </>
          )}
        </CartProvider>
      </body>
    </html>
  )
}

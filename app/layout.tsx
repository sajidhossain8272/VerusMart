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
  icons: {
    icon: '/admin_uploads/logo.png',
    apple: '/admin_uploads/logo.png',
  },
  appleWebApp: {
    title: 'VerusMart',
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
          <meta name="apple-mobile-web-app-title" content="VerusMart" />
          <link rel="icon" href="/admin_uploads/logo.png" />
          <link rel="apple-touch-icon" href="/admin_uploads/logo.png" />
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
        <meta name="apple-mobile-web-app-title" content="VerusMart" />
        <link rel="icon" href="/admin_uploads/logo.png" />
        <link rel="apple-touch-icon" href="/admin_uploads/logo.png" />
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
        {/* End Google Tag Manager */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={roboto.variable}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M4WDWDWX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1004819899041313');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1004819899041313&ev=PageView&noscript=1"
            alt="Meta Pixel"
          />
        </noscript>
        {/* End Meta Pixel Code */}

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

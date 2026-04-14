import React from 'react'
import { Inter, Playfair_Display } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { BrandFooter as Footer } from '@/components/layout/BrandFooter'
import { LoadingScreen } from '@/components/layout/LoadingScreen'
import { ViewportHandler } from '@/components/ui/ViewportHandler'
import { OrganizationSchema } from '@/components/SEO/OrganizationSchema'
import { getPayload } from 'payload'
import config from '@payload-config'
import { FreshnessHandler } from '@/components/ui/FreshnessHandler'
import { ScrollToTopFab } from '@/components/ui/ScrollToTopFab'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import './styles.css'

const CartDrawer = dynamic(() => import('@/components/Cart/CartDrawer').then(mod => mod.CartDrawer))

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://japanese-kitchen-knives.com.ua'),
  title: 'Japanese Kitchen Knives | Преміальні японські ножі в Україні',
  description: 'Купити преміальні японські ножі ручної роботи в Україні. Великий асортимент кухонних ножів від майстрів Sakai, Sanjo та Echizen. В наявності та під замовлення. Швидка доставка та гарантія якості.',
  alternates: {
    canonical: './',
  },
  openGraph: {
    title: 'Japanese Kitchen Knives | Преміальні японські ножі в Україні',
    description: 'Купити преміальні японські ножі ручної роботи в Україні. Великий асортимент кухонних ножів від майстрів Sakai, Sanjo та Echizen.',
    url: './',
    siteName: 'Japanese Kitchen Knives',
    images: [
      {
        url: '/images/hero_knife-1920.webp',
        width: 1200,
        height: 630,
        alt: 'Premium Japanese Knives',
      },
    ],
    locale: 'uk_UA',
    type: 'website',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: ['/favicon.svg'],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: false })

  return (
    <html lang="uk" className={`${inter.variable} ${playfair.variable} light`} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var gtmLoaded = false;
                function loadGTM() {
                  if (gtmLoaded) return;
                  gtmLoaded = true;
                  // Remove listeners
                  window.removeEventListener('scroll', loadGTM);
                  window.removeEventListener('mousemove', loadGTM);
                  window.removeEventListener('touchstart', loadGTM);
                  
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-5BK9W2PZ');
                }
                
                // Load GTM on interaction
                window.addEventListener('scroll', loadGTM, { passive: true });
                window.addEventListener('mousemove', loadGTM, { passive: true });
                window.addEventListener('touchstart', loadGTM, { passive: true });
                
                // Fallback to load GTM after 5 seconds of idle time if no interaction
                if (window.requestIdleCallback) {
                  requestIdleCallback(function() {
                    setTimeout(loadGTM, 5000);
                  });
                } else {
                  setTimeout(loadGTM, 5000);
                }
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const isBot = /bot|googlebot|lighthouse|pagespeed|crawler|spider|robot|crawling/i.test(navigator.userAgent);
                if (localStorage.getItem('knives_intro_played') || isBot) {
                  document.documentElement.classList.add('skip-intro');
                } else {
                  localStorage.setItem('knives_intro_played', 'true');
                }
              } catch (e) {}
              
              // Global Image & Content Protection
              document.addEventListener('contextmenu', (e) => {
                const target = e.target;
                if (target instanceof HTMLElement && (target.tagName === 'IMG' || target.closest('picture'))) {
                  e.preventDefault();
                }
              }, true);
              
              document.addEventListener('dragstart', (e) => {
                const target = e.target;
                if (target instanceof HTMLElement && (target.tagName === 'IMG' || target.closest('picture'))) {
                  e.preventDefault();
                }
              }, true);
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col selection:bg-neutral-800 selection:text-white">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5BK9W2PZ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <OrganizationSchema phone={settings.contactPhone} email={settings.contactEmail} />
        <FreshnessHandler initialVersion={settings.contentVersion || 'init'} />
        <ViewportHandler />
        {/* <LoadingScreen /> */}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <ScrollToTopFab />
      </body>
    </html>
  )
}

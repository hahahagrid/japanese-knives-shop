import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './styles.css'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Header } from '@/components/Header'
import { BrandFooter } from '@/components/BrandFooter'
import { CartDrawer } from '@/components/Cart/CartDrawer'
import { MobileMenu } from '@/components/MobileMenu'
import Script from 'next/script'
import { LoadingScreen } from '@/components/LoadingScreen'
import { ScrollToTopFab } from '@/components/ScrollToTopFab'
import { LazyMotion } from 'framer-motion'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-playfair' })

const loadFeatures = () => import('@/lib/framer-features').then((res) => res.default)

export const metadata: Metadata = {
  title: 'Японські кухонні ножі | Магазин ексклюзивних ножів',
  description: 'Інтернет-магазин японських ножів ручної роботи. Великий вибір кухонних ножів від найкращих майстрів Японії.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/favicon.svg'],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  
  return (
    <html lang="uk" className={`${inter.variable} ${playfair.variable} light`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5BK9W2PZ');`,
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
      <body className="antialiased min-h-screen flex flex-col pt-20">
        <LazyMotion features={loadFeatures} strict>
          <Header />
          <main className="flex-grow">{children}</main>
          <BrandFooter />
          <CartDrawer />
          <MobileMenu />
          <LoadingScreen />
          <ScrollToTopFab />
        </LazyMotion>
      </body>
    </html>
  )
}

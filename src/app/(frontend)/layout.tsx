import React from 'react'
import { Inter, Playfair_Display } from 'next/font/google'
import { Header } from '@/components/Header'
import { BrandFooter as Footer } from '@/components/BrandFooter'
import { CartDrawer } from '@/components/Cart/CartDrawer'
import { LoadingScreen } from '@/components/LoadingScreen'
import { ViewportHandler } from '@/components/ViewportHandler'
import { OrganizationSchema } from '@/components/SEO/OrganizationSchema'
import { getPayload } from 'payload'
import config from '@payload-config'
import { FreshnessHandler } from '@/components/FreshnessHandler'
import './styles.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://japanese-kitchen-knives.com.ua'),
  title: 'KNIVES | Преміальні японські ножі в Україні',
  description: 'Купити преміальні японські ножі ручної роботи в Україні. Великий асортимент кухонних ножів від майстрів Sakai, Sanjo та Echizen. В наявності та під замовлення. Швидка доставка та гарантія якості.',
  alternates: {
    canonical: './',
  },
  openGraph: {
    title: 'KNIVES | Преміальні японські ножі в Україні',
    description: 'Купити преміальні японські ножі ручної роботи в Україні. Великий асортимент кухонних ножів від майстрів Sakai, Sanjo та Echizen.',
    url: './',
    siteName: 'KNIVES',
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
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: false })

  return (
    <html lang="uk" className={`${inter.variable} ${playfair.variable} light`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (sessionStorage.getItem('knives_intro_played')) {
                  document.documentElement.classList.add('skip-intro');
                } else {
                  sessionStorage.setItem('knives_intro_played', 'true');
                }
              } catch (e) {}
              
              // Global Image & Content Protection
              document.addEventListener('contextmenu', (e) => {
                if (e.target.tagName === 'IMG' || e.target.closest('picture')) {
                  e.preventDefault();
                }
              }, true);
              
              document.addEventListener('dragstart', (e) => {
                if (e.target.tagName === 'IMG' || e.target.closest('picture')) {
                  e.preventDefault();
                }
              }, true);
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col selection:bg-neutral-800 selection:text-white">
        <OrganizationSchema phone={settings.contactPhone} email={settings.contactEmail} />
        <FreshnessHandler initialVersion={settings.contentVersion || 'init'} />
        <ViewportHandler />
        <LoadingScreen />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  )
}

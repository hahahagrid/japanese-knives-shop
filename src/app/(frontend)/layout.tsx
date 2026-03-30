import React from 'react'
import { Inter, Playfair_Display } from 'next/font/google'
import { Header } from '@/components/Header'
import { BrandFooter as Footer } from '@/components/BrandFooter'
import { CartDrawer } from '@/components/Cart/CartDrawer'
import { LoadingScreen } from '@/components/LoadingScreen'
import { ViewportHandler } from '@/components/ViewportHandler'
import './styles.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata = {
  title: 'KNIVES | Преміальні японські ножі в Україні',
  description: 'Інтернет-магазин японських ножів ручної роботи. В наявності та під замовлення.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

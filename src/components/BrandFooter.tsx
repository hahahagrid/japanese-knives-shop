import React from 'react'
import Link from 'next/link'
import { Logo } from './Logo'
import { Send } from 'lucide-react'

export const BrandFooter: React.FC = () => {
  return (
    <footer className="bg-[#0A0A09] text-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-24">
          {/* Brand */}
          <div className="flex flex-col gap-4 max-w-xs">
            <Logo className="self-start py-3 px-8 text-3xl" />
            <p className="text-sm text-neutral-400 leading-relaxed">
              Автентичні японські ножі ручної роботи. Преміальна якість. Доставка по Україні.
            </p>

            {/* Socials */}
            <div className="flex gap-4 mt-2">
              <a
                href="#"
                aria-label="Instagram"
                className="p-2 border border-neutral-800 hover:border-neutral-500 transition-colors group"
              >
                {/* Instagram SVG */}
                <svg className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Telegram"
                className="p-2 border border-neutral-800 hover:border-neutral-500 transition-colors group"
              >
                <Send className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Каталог</p>
              <Link href="/in-stock" className="text-sm text-neutral-400 hover:text-white transition-colors">В наявності</Link>
              <Link href="/custom-order" className="text-sm text-neutral-400 hover:text-white transition-colors">Під замовлення</Link>
              <Link href="/blog" className="text-sm text-neutral-400 hover:text-white transition-colors">Блог</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Інфо</p>
              <Link href="/about" className="text-sm text-neutral-400 hover:text-white transition-colors">Про нас</Link>
              <Link href="/shipping" className="text-sm text-neutral-400 hover:text-white transition-colors">Оплата та доставка</Link>
              <Link href="/contacts" className="text-sm text-neutral-400 hover:text-white transition-colors">Контакти</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-900 text-center text-xs text-neutral-700">
          © {new Date().getFullYear()} KNIVES. Всі права захищені.
        </div>
      </div>
    </footer>
  )
}

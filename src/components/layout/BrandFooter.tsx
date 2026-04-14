import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { Logo } from '../ui/Logo'
import { Send } from 'lucide-react'

export const BrandFooter: React.FC = async () => {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: false })

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

            {/* Notable Socials */}
            <div className="flex gap-4 mt-6">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl as string}
                  id="link-footer-instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-3 border border-neutral-800 hover:border-neutral-500 hover:bg-neutral-900 transition-all duration-300 group rounded-sm"
                >
                  <svg
                    className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              )}
              {settings.telegramUrl && (
                <a
                  href={settings.telegramUrl as string}
                  id="link-footer-telegram"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="p-3 border border-neutral-800 hover:border-neutral-500 hover:bg-neutral-900 transition-all duration-300 group rounded-sm"
                >
                  <Send className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" />
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl as string}
                  id="link-footer-youtube"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="p-3 border border-neutral-800 hover:border-neutral-500 hover:bg-neutral-900 transition-all duration-300 group rounded-sm"
                >
                  <svg
                    className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.46-5.58z" />
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Nav columns */}
          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Каталог</p>
              <Link
                href="/knives/in-stock"
                id="link-footer-in-stock"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                В наявності
              </Link>
              <Link
                href="/knives/custom-order"
                id="link-footer-custom-order"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Під замовлення
              </Link>
              <Link
                href="/accessories"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Аксесуари
              </Link>
              <Link
                href="/blog"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Блог
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Інфо</p>
              <Link
                href="/"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Головна
              </Link>
              <Link
                href="/about"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Про нас
              </Link>
              <Link
                href="/shipping"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Оплата та доставка
              </Link>
              <Link
                href="/contacts"
                id="link-footer-contacts"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Контакти
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-900 text-center text-xs text-neutral-700">
          © {new Date().getFullYear()} Japanese Kitchen Knives. Всі права захищені.
        </div>
      </div>
    </footer>
  )
}

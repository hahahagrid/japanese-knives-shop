export const revalidate = 86400

import { getPayload } from 'payload'
import config from '@payload-config'
import { ContactForm } from '@/components/ContactForm'
import { AnimatedSection } from '@/components/AnimatedSection'
import { Phone, Mail, Clock, MapPin } from 'lucide-react'
import { PageVersion } from '@/components/PageVersion'

export const metadata = {
  title: 'Контакти | K N I V E S',
}

export default async function ContactsPage() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: false })

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-28 pb-16 md:py-24">
      <PageVersion />
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-24 items-start">
        {/* Unified Intro & Contact Info Block */}
        <AnimatedSection className="order-1">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--muted)] mb-3">
            Зв&apos;язок
          </p>
          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-8 leading-[1.1]">
            Ми завжди
            <br />
            на зв&apos;язку
          </h1>
          <p className="text-lg text-neutral-500 leading-relaxed mb-8 max-w-md">
            Маєте запитання щодо вибору ножа або бажаєте замовити індивідуальну модель? Напишіть
            нам, і ми допоможемо обрати ідеальний інструмент.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 mb-8">
            {settings.contactPhone && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[var(--muted)] opacity-60">
                  <Phone className="h-3 w-3" />
                  <span className="text-[9px] uppercase tracking-widest font-bold">Телефон</span>
                </div>
                <p className="text-lg text-neutral-500">{settings.contactPhone}</p>
              </div>
            )}

            {settings.contactEmail && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[var(--muted)] opacity-60">
                  <Mail className="h-3 w-3" />
                  <span className="text-[9px] uppercase tracking-widest font-bold">Email</span>
                </div>
                <p className="text-lg text-neutral-500">{settings.contactEmail}</p>
              </div>
            )}

            {settings.workHours && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[var(--muted)] opacity-60">
                  <Clock className="h-3 w-3" />
                  <span className="text-[9px] uppercase tracking-widest font-bold">Графік</span>
                </div>
                <p className="text-lg text-neutral-500">{settings.workHours}</p>
              </div>
            )}

            {settings.address && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[var(--muted)] opacity-60">
                  <MapPin className="h-3 w-3" />
                  <span className="text-[9px] uppercase tracking-widest font-bold">Локація</span>
                </div>
                <p className="text-lg text-neutral-500">{settings.address}</p>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="flex gap-4 mt-12">
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-sm group/icon"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5 text-neutral-600 group-hover/icon:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
            )}
            {settings.telegramUrl && (
              <a
                href={settings.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-sm group/icon"
                aria-label="Telegram"
              >
                <svg className="h-5 w-5 text-neutral-600 group-hover/icon:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </a>
            )}
            {settings.youtubeUrl && (
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-sm group/icon"
                aria-label="YouTube"
              >
                <svg className="h-5 w-5 text-neutral-600 group-hover/icon:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="m10 15 5-3-5-3v6Z" />
                </svg>
              </a>
            )}
          </div>
        </AnimatedSection>

        {/* Form - Order 2 on Mobile */}
        <AnimatedSection delay={0.2} className="w-full order-2 lg:col-start-2 lg:row-span-2">
          <ContactForm />
        </AnimatedSection>
      </div>
    </div>
  )
}

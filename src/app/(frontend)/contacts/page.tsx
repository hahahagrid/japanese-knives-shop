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
        </AnimatedSection>

        {/* Form - Order 2 on Mobile */}
        <AnimatedSection delay={0.2} className="w-full order-2 lg:col-start-2 lg:row-span-2">
          <ContactForm />
        </AnimatedSection>
      </div>
    </div>
  )
}

import { getPayload } from 'payload'
import config from '@payload-config'
import { ContactForm } from '@/components/ContactForm'
import { AnimatedSection } from '@/components/AnimatedSection'
import { Phone, Mail, Clock, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Контакти | K N I V E S',
}

export default async function ContactsPage() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: false })

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--muted)] mb-3">Зв&apos;язок</p>
          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-10 leading-[1.1]">
            Ми завжди<br />на зв&apos;язку
          </h1>
          <p className="text-lg text-neutral-500 leading-relaxed mb-16 max-w-md">
            Маєте запитання щодо вибору ножа або бажаєте замовити індивідуальну модель? Напишіть нам, і ми допоможемо обрати ідеальний інструмент.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
            {settings.contactPhone && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[var(--muted)]">
                  <Phone className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Телефон</span>
                </div>
                <p className="text-lg font-medium">{settings.contactPhone}</p>
              </div>
            )}
            
            {settings.contactEmail && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[var(--muted)]">
                  <Mail className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Email</span>
                </div>
                <p className="text-lg font-medium">{settings.contactEmail}</p>
              </div>
            )}

            {settings.workHours && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[var(--muted)]">
                  <Clock className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Графік</span>
                </div>
                <p className="text-base">{settings.workHours}</p>
              </div>
            )}

            {settings.address && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[var(--muted)]">
                  <MapPin className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Локація</span>
                </div>
                <p className="text-base">{settings.address}</p>
              </div>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <ContactForm />
        </AnimatedSection>
      </div>
    </div>
  )
}

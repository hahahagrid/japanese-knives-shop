import { AnimatedSection } from '@/components/AnimatedSection'
import Link from 'next/link'

export const metadata = {
  title: 'Політика конфіденційності | Japanese Kitchen Knives',
  description: 'Прозорі правила обробки ваших даних для безпечного замовлення японських ножів.',
  openGraph: {
    title: 'Політика конфіденційності | Japanese Kitchen Knives',
    description: 'Прозорі правила обробки ваших даних для безпечного замовлення японських ножів.',
    url: 'https://japanese-kitchen-knives.com.ua/privacy',
    siteName: 'Japanese Kitchen Knives',
    images: [{ url: '/images/logo.png', width: 1200, height: 630, alt: 'Japanese Kitchen Knives' }],
    locale: 'uk_UA',
    type: 'website',
  },
}

export default function PrivacyPage() {
  const lastUpdated = '04 квітня 2026 року'

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pt-32 pb-16 md:pt-40 md:pb-24 relative z-10">
      <AnimatedSection>
        <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--muted)] mb-3">ДОКУМЕНТАЦІЯ</p>
        <h1 className="heading-display text-4xl md:text-5xl lg:text-5xl mb-8">
          Політика конфіденційності
        </h1>
        <p className="text-sm text-neutral-400 italic font-serif mb-12">
          Останнє оновлення: {lastUpdated}
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="space-y-12 text-neutral-600 leading-relaxed font-light">
        <section className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-black border-b border-black/10 pb-4">1. Загальні положення</h2>
          <p>
            Ця Політика конфіденційності діє для веб-сайту нашого магазину японських ножів ручної роботи. Ми з великою повагою ставимося до ваших персональних даних та прагнемо забезпечити їхню максимальну безпеку та конфіденційність.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-black border-b border-black/10 pb-4">2. Які дані ми збираємо</h2>
          <p>При оформленні замовлення або заповненні контактної форми ми можемо збирати наступну інформацію:</p>
          <ul className="list-disc pl-5 space-y-2 marker:text-[var(--accent)]">
            <li><strong>Персональні дані:</strong> прізвище, ім&apos;я, номер телефону, email.</li>
            <li><strong>Дані доставки:</strong> адреса або номер відділення поштової служби.</li>
            <li><strong>Технічні дані (автоматично):</strong> IP-адреса, приблизне місцезнаходження (місто, країна), тип пристрою та версія браузера.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-black border-b border-black/10 pb-4">3. Чому ми це робимо (Мета обробки)</h2>
          <p>Ми використовуємо ваші дані виключно для:</p>
          <ul className="list-disc pl-5 space-y-2 marker:text-[var(--accent)]">
            <li>Якісного опрацювання ваших замовлень та зв&apos;язку з вами;</li>
            <li><strong>Запобігання шахрайству та бот-атакам:</strong> збір IP та технічних даних допомагає нам блокувати автоматичні спам-замовлення;</li>
            <li>Покращення нашого сервісу на основі аналізу відвідуваності.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-black border-b border-black/10 pb-4">4. Захист та зберігання</h2>
          <p>
            Ми вживаємо всіх необхідних технічних заходів для захисту вашої інформації від несанкціонованого доступу. Технічні метадані (IP-адреси) зберігаються у зашифрованій базі даних та використовуються лише для внутрішнього аудиту безпеки.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-black border-b border-black/10 pb-4">5. Ваші права</h2>
          <p>Ви маєте право у будь-який момент вимагати видалення ваших персональних даних з нашої бази. Для цього ви можете зв&apos;язатися з нами за контактним номером телефону або написати на наш email.</p>
        </section>

        <section className="pt-8 border-t border-black/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-sm italic">
            Ми не передаємо ваші дані третім особам, крім служб доставки для виконання вашого замовлення.
          </p>
          <Link href="/" className="text-[11px] font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:opacity-60 transition-opacity whitespace-nowrap">
            На головну
          </Link>
        </section>
      </AnimatedSection>
    </div>
  )
}

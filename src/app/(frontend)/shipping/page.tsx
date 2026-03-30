export const revalidate = 86400

import React from 'react'
import { AnimatedSection } from '@/components/AnimatedSection'
import { CreditCard, Truck, ShieldCheck, Clock, Shield, RefreshCw } from 'lucide-react'

export const metadata = {
  title: 'Оплата та доставка | K N I V E S',
  description: 'Інформація про способи оплати та умови доставки японських ножів.',
}

export default function ShippingPage() {
  const hero = {
    title: 'Оплата та доставка',
    subtitle: 'Прозорі умови, швидка відправка та надійна упаковка для кожного ножа.',
  }
  const payment = {
    title: 'Оплата',
    methods: [
      { method: 'Картою (за реквізитами) — оплата здійснюється після підтвердження замовлення' },
      {
        method:
          'Доставка за передплатою — відправка товару виконується після повної або часткової оплати (страховий платіж)',
      },
      {
        method:
          'Безпечна угода — гарантуємо швидку обробку замовлення та надання ТТН одразу після відправки',
      },
    ],
  }
  const delivery = {
    title: 'Доставка',
    methods: [
      { method: 'Нова Пошта (до відділення або поштомату)' },
      { method: "Кур'єрська доставка Нової Пошти" },
      { method: 'Міжнародна доставка (за індивідуальною домовленістю)' },
    ],
  }
  const extraInfo = (
    <p>
      Зверніть увагу, що при оформленні накладеного платежу кур'єрська служба стягує додаткову
      комісію за зворотний переказ коштів.
    </p>
  )

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-[#0A0A09] text-white pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="absolute left-[-5%] top-[50%] -translate-y-1/2 text-[25vw] font-serif opacity-[0.05] select-none pointer-events-none">
          道
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-500 mb-4 font-bold">
              Умови Замовлення
            </p>
            <h1 className="heading-display text-5xl md:text-6xl lg:text-8xl mb-6">{hero.title}</h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed font-light italic font-serif">
              {hero.subtitle}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Details Grid */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Payment */}
            <AnimatedSection className="p-10 border border-[var(--border)] bg-[var(--stone-50)]">
              <div className="flex items-center gap-4 mb-8">
                <CreditCard className="w-8 h-8 text-[var(--gold)]" />
                <h2 className="heading-display text-3xl">{payment.title}</h2>
              </div>
              <ul className="space-y-4">
                {payment.methods.map((m, i) => (
                  <li key={i} className="flex items-start gap-3 text-[var(--muted)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mt-2 shrink-0" />
                    <span className="text-lg">{m.method}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            {/* Delivery */}
            <AnimatedSection
              delay={0.1}
              className="p-10 border border-[var(--border)] bg-[var(--stone-50)]"
            >
              <div className="flex items-center gap-4 mb-8">
                <Truck className="w-8 h-8 text-[var(--gold)]" />
                <h2 className="heading-display text-3xl">{delivery.title}</h2>
              </div>
              <ul className="space-y-4">
                {delivery.methods.map((m, i) => (
                  <li key={i} className="flex items-start gap-3 text-[var(--muted)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mt-2 shrink-0" />
                    <span className="text-lg">{m.method}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {[
              { icon: ShieldCheck, title: 'Автентичність', text: 'Гарантія автентичності товару' },
              { icon: Clock, title: 'Швидкість', text: 'Відправка протягом 24 годин' },
              { icon: Shield, title: 'Страхування', text: 'Повне страхування на суму вартості' },
              { icon: RefreshCw, title: 'Обмін', text: 'Обмін або повернення за домовленістю' },
            ].map((item, i) => (
              <AnimatedSection
                key={i}
                delay={i * 0.1}
                className="text-center p-6 grayscale hover:grayscale-0 transition-all"
              >
                <item.icon className="w-10 h-10 mx-auto mb-4 text-[var(--gold)]" />
                <h3 className="font-serif font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted)]">{item.text}</p>
              </AnimatedSection>
            ))}
          </div>

          {/* Extra Info */}
          <AnimatedSection className="mt-32 max-w-3xl mx-auto prose prose-neutral text-center italic text-[var(--muted)]">
            {extraInfo}
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

export const revalidate = 86400

import React from 'react'
import { AnimatedSection } from '@/components/AnimatedSection'
import Image from 'next/image'
import { Sword, Gem, ShieldCheck, Zap, Mail, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { PageVersion } from '@/components/PageVersion'

export const metadata = {
  title: 'Про нас | Japanese Kitchen Knives',
  description:
    'З 2020 року ми привозимо оригінальні японські кухонні ножі від майстрів Sakai, Sanjo, Echizen та Tosa. Гарантія автентичності кожного виробу.',
  openGraph: {
    title: 'Про нас | Japanese Kitchen Knives',
    description:
      'З 2020 року ми привозимо оригінальні японські кухонні ножі від майстрів Sakai, Sanjo, Echizen та Tosa. Гарантія автентичності кожного виробу.',
    url: 'https://japanese-kitchen-knives.com.ua/about',
    siteName: 'Japanese Kitchen Knives',
    images: [{ url: '/images/logo.png', width: 1200, height: 630, alt: 'Japanese Kitchen Knives' }],
    locale: 'uk_UA',
    type: 'website',
  },
}

export default function AboutPage() {
  const hero = {
    title: 'Japanese Knives Shop',
    subtitle: 'Шедеври японського мистецтва у ваших руках. Виняткова гострота, перевірена часом.',
  }

  const intro = {
    title: 'Майстерність та Автентичність',
    text: (
      <>
        <p className="mb-6">Вітаємо!</p>
        <p className="mb-6">Ми - магазин оригінальних японських ножів.</p>
        <p className="mb-6">
          З 2020 року ми займаємось продажем японських кухонних ножів та аксесуарів. Усі ножі,
          представлені в нашому асортименті, придбані виключно в Японії:{' '}
          <strong>Sakai, Sanjo, Echizen, Tosa, Miki</strong> та інших регіонах.
        </p>
        <p>
          Наша місія - зробити професійні інструменти доступними для кожного, хто цінує
          безкомпромісну якість та естетику в роботі. Ми гарантуємо автентичність кожного виробу, бо
          знаємо історію кожного майстра, з яким працюємо.
        </p>
      </>
    ),
    image: '/images/about-hero.jpg',
  }

  const offerings = [
    {
      icon: Sword,
      title: 'Професійні ножі',
      description: 'Ексклюзивні клинки від кращих ковалів та сімейних фабрик Японії.',
    },
    {
      icon: Gem,
      title: 'Точильні камені',
      description: 'Природні та синтетичні водяні камені для ідеальної заточки.',
    },
    {
      icon: Zap,
      title: 'Керамічні мусати',
      description: 'Надійний інструмент для швидкої правки та підтримки гостроти щодня.',
    },
    {
      icon: ShieldCheck,
      title: 'Шкіряні чохли',
      description: 'Стильні аксесуари ручної роботи для безпечного зберігання та транспортування.',
    },
  ]

  return (
    <div className="flex flex-col">
      <PageVersion />
      {/* Hero Section */}
      <section className="bg-[#0A0A09] text-white pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="absolute right-[-10%] top-[50%] -translate-y-1/2 text-[30vw] font-serif opacity-[0.06] select-none pointer-events-none">
          魂
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <AnimatedSection>
            <p className="text-label mb-4 text-neutral-500">Наша Спадщина</p>
            <h1 className="heading-display text-5xl md:text-6xl lg:text-8xl mb-6">{hero.title}</h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed font-light italic font-serif">
              {hero.subtitle}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 md:py-40 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <AnimatedSection className="order-2 lg:order-1">
              <span className="text-label mb-6 block text-neutral-500">Про нас</span>
              <h2 className="heading-display text-4xl md:text-6xl mb-10">{intro.title}</h2>
              <div className="prose prose-neutral max-w-none text-neutral-600 text-lg leading-relaxed">
                {intro.text}
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="order-1 lg:order-2">
              <div className="relative aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl">
                <Image
                  src={intro.image}
                  alt={intro.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute inset-0 border-[1px] border-white/20 m-6" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Offerings Grid */}
      <section className="py-24 md:py-32 bg-[var(--stone-50)] border-y border-[var(--border)]">
        <div className="container mx-auto px-4 max-w-7xl text-center mb-16">
          <AnimatedSection>
            <h2 className="heading-display text-4xl md:text-5xl mb-6">У нас представлені</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              Ми ретельно підбираємо кожен товар в наш асортимент, щоб ви отримували лише найкраще.
            </p>
          </AnimatedSection>
        </div>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {offerings.map((item, i) => (
              <AnimatedSection
                key={i}
                delay={i * 0.1}
                className="p-10 bg-white border border-[var(--border)] group hover:border-black transition-all duration-500"
              >
                <item.icon className="w-10 h-10 mb-8 text-black stroke-[1px]" />
                <h3 className="heading-display text-2xl mb-4 group-hover:text-black transition-colors">
                  {item.title}
                </h3>
                <p className="text-neutral-500 leading-relaxed text-sm">{item.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Order - Concierge Service */}
      <section className="py-24 md:py-40 bg-white relative overflow-hidden">
        <div className="absolute left-[-5%] bottom-0 text-[15vw] font-serif opacity-[0.03] select-none pointer-events-none">
          匠
        </div>
        <div className="container mx-auto px-4 max-w-5xl">
          <AnimatedSection className="bg-[#0A0A09] text-white p-12 md:p-20 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <span className="text-label mb-6 block text-neutral-500">Ексклюзивна послуга</span>
                <h2 className="heading-display text-3xl md:text-5xl mb-8">
                  Індивідуальний підбір та доставка
                </h2>
                <p className="text-neutral-400 text-lg leading-relaxed mb-10">
                  Не знайшли ідеальну модель ножа? Це не проблема. Ми привеземо потрібний клинок з
                  Японії, згідно ваших побажань. Терміни та деталі обговорюються індивідуально.
                </p>
                <div className="flex flex-wrap gap-6">
                  <Link
                    href="/contacts"
                    className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-sm uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Написати нам
                  </Link>
                </div>
              </div>
              <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 border border-white/20 flex items-center justify-center rotate-45 group">
                <div className="rotate-[-45deg] text-center">
                  <span className="block text-4xl md:text-6xl font-serif text-white">特</span>
                  <span className="text-[8px] uppercase tracking-[0.2em] text-neutral-500">
                    Special
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

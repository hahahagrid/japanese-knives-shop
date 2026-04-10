export const revalidate = 86400

export const metadata = {
  title: 'Japanese Kitchen Knives | Оригінальні японські кухонні ножі',
  description:
    'Найкращі японські кухонні ножі ручної роботи від майстрів Sakai, Sanjo та Echizen. 100% оригінал, прямі поставки з Японії.',
  openGraph: {
    title: 'Japanese Kitchen Knives | Оригінальні японські кухонні ножі',
    description:
      'Найкращі японські кухонні ножі ручної роботи від майстрів Sakai, Sanjo та Echizen. 100% оригінал, прямі поставки з Японії.',
    url: 'https://japanese-kitchen-knives.com.ua',
    siteName: 'Japanese Kitchen Knives',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Japanese Kitchen Knives Logo',
      },
    ],
    locale: 'uk_UA',
    type: 'website',
  },
}

import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { KnifeCard } from '@/components/KnifeCard'
import { AnimatedSection } from '@/components/AnimatedSection'
import { ReviewsMarquee } from '@/components/ReviewsMarquee'
import { ArrowDown, Plane, ShieldCheck, Truck, MessageSquare } from 'lucide-react'
import { ManufacturerCard } from '@/components/ManufacturerCard'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ChevronUp } from 'lucide-react'
import { PageVersion } from '@/components/PageVersion'

const manufacturers = [
  { en: 'Yoshimi Kato', jp: '加藤 義実' },
  { en: 'Shigeki Tanaka', jp: '田中 誠貴' },
  { en: 'Moritaka Hamono', jp: '盛高 刃物' },
  { en: 'Kei Kobayashi', jp: '小林 圭' },
  { en: 'Yoshihiro', jp: '義弘' },
  { en: 'Takamura Hamono', jp: '高村 刃物' },
  { en: 'Kazuyuki Tanaka', jp: '田中 和之' },
  { en: 'Yuji Kurosaki', jp: '黒崎 優' },
  { en: 'Anryu Hamono', jp: '安立 刃物' },
  { en: 'Koutetsu Hamono', jp: '硬鉄 刃物' },
  { en: 'Takeshi Saji', jp: '佐治 武士' },
  { en: 'Matsubara Hamono', jp: '松原 刃物' },
  { en: 'Sakai Takayuki', jp: '堺 孝行' },
  { en: 'Takeda', jp: '武田' },
  { en: 'Shiro Kamo', jp: '加茂 志朗' },
  { en: 'Tsutomu Kajiwara', jp: '梶原 勉' },
  { en: 'Yuta Katayama', jp: '片山 雄太' },
  { en: 'Toshitaka', jp: '俊隆' },
  { en: 'Sukenari', jp: '祐成' },
  { en: 'Masanobu Okada', jp: '岡田 正信' },
]

const advantages = [
  {
    num: '01',
    title: '100% Оригінал',
    text: 'Прямі поставки від майстрів із Японії. Сертифікати автентичності на кожен ніж.',
  },
  {
    num: '02',
    title: 'Ручна робота',
    text: 'Унікальний процес кування та заточки. Кожен виріб - результат багаторічного досвіду.',
  },
  {
    num: '03',
    title: 'Преміум сталь',
    text: 'VG-10, Aogami Super, Shirogami, авторський дамаск. Матеріали, що витримують час.',
  },
]

export default async function HomePage() {
  const payload = await getPayload({ config })

  const { docs: inStockKnives } = await payload.find({
    collection: 'products',
    where: {
      and: [{ status: { equals: 'in_stock' } }, { type: { equals: 'knife' } }],
    },
    limit: 4,
    overrideAccess: false,
    depth: 1,
  })

  const { docs: customKnives } = await payload.find({
    collection: 'products',
    where: {
      and: [{ status: { equals: 'custom_order' } }, { type: { equals: 'knife' } }],
    },
    limit: 4,
    overrideAccess: false,
    depth: 1,
  })

  // Fetch Reviews
  const homepageReviews = await payload.findGlobal({
    slug: 'homepage-reviews',
    overrideAccess: false,
    depth: 1,
  })

  const rawReviews = homepageReviews?.images || []
  const reviewUrls = rawReviews
    .map((img: any) => (typeof img === 'object' && img?.url ? img.url : null))
    .filter(Boolean) as string[]

  return (
    <div className="flex flex-col">
      <PageVersion />
      {/* ── Hero ──────────────────────────────────── */}
      <section
        className="relative h-[92svh] md:h-[92vh] min-h-[600px] flex items-end overflow-hidden bg-black text-white"
        style={{ height: 'calc(var(--vh, 1vh) * 92)' }}
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <Image
            src="/images/hero_knife-1920.webp"
            alt="Premium Japanese Knife"
            fill
            priority
            {...({ fetchPriority: 'high' } as any)}
            className="object-cover opacity-55"
            style={{ objectPosition: 'center 40%' }}
            sizes="100vw"
            quality={50}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        </div>

        <div className="relative z-10 w-full pb-16 md:pb-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-label text-white/50 mb-6">Мистецтво ідеального різу</p>
              <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-white mb-8">
                Японські
                <br />
                Кухонні
                <br />
                Ножі
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  href="/knives/in-stock"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-black py-5 px-10 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors duration-300 shadow-lg"
                >
                  Каталог в наявності
                </Link>
                <Link
                  href="/knives/custom-order"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border border-white/50 text-white py-5 px-10 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white/10 transition-colors duration-300 shadow-lg"
                >
                  Під замовлення
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-1 right-8 z-10 flex flex-col items-center gap-2 text-white/40 animate-fade-in"
          style={{ animationDelay: '800ms' }}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase rotate-90 origin-center mb-2">
            Вниз
          </span>
          <ArrowDown className="h-4 w-4 animate-scroll-bounce" />
        </div>
      </section>

      {/* ── Trust Bar ───────────────────────────────── */}
      <section className="bg-white border-b border-black/[0.05] py-10 md:py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 lg:gap-y-0">
            {/* Item 1 */}
            <div className="flex flex-col items-center text-center px-4 lg:border-r lg:border-black/[0.05] last:border-0">
              <Plane className="h-6 w-6 mb-4 text-black stroke-[1px]" />
              <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase leading-tight max-w-[140px]">
                Прямі поставки з Японії
              </p>
            </div>
            {/* Item 2 */}
            <div className="flex flex-col items-center text-center px-4 lg:border-r lg:border-black/[0.05] last:border-0">
              <ShieldCheck className="h-6 w-6 mb-4 text-black stroke-[1px]" />
              <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase leading-tight max-w-[140px]">
                100% оригінальні ножі
              </p>
            </div>
            {/* Item 3 */}
            <div className="flex flex-col items-center text-center px-4 lg:border-r lg:border-black/[0.05] last:border-0">
              <Truck className="h-6 w-6 mb-4 text-black stroke-[1px]" />
              <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase leading-tight max-w-[140px]">
                Доставка по Україні 1–2 дні
              </p>
            </div>
            {/* Item 4 */}
            <div className="flex flex-col items-center text-center px-4 lg:border-r lg:border-black/[0.05] last:border-0">
              <MessageSquare className="h-6 w-6 mb-4 text-black stroke-[1px]" />
              <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase leading-tight max-w-[140px]">
                Допомагаємо підібрати під задачу
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. In Stock Section ────────────────────────── */}
      {inStockKnives.length > 0 && (
        <section className="bg-[#FAFAF9] py-20 md:py-32 border-b border-black/[0.03]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <AnimatedSection className="flex justify-between items-end mb-10">
              <div>
                <p className="text-label mb-2">Колекція</p>
                <h2 className="heading-display text-3xl md:text-4xl">В наявності</h2>
              </div>
              <Link
                href="/knives/in-stock"
                className="inline-flex text-[10px] sm:text-xs tracking-widest uppercase items-center gap-2 border-b border-foreground pb-0.5 hover:opacity-50 transition-opacity"
              >
                Всі ножі
              </Link>
            </AnimatedSection>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-8">
              {inStockKnives.map((knife, index) => {
                const firstImage = knife.images?.[0]
                const secondImage = knife.images?.[1]
                const imgUrl =
                  typeof firstImage === 'object' && firstImage !== null
                    ? firstImage.sizes?.thumbnail?.url ||
                      firstImage.sizes?.card?.url ||
                      firstImage.url
                    : null
                const hoverImgUrl =
                  typeof secondImage === 'object' && secondImage !== null
                    ? secondImage.sizes?.thumbnail?.url ||
                      secondImage.sizes?.card?.url ||
                      secondImage.url
                    : null
                return (
                  <div key={knife.id}>
                    <KnifeCard
                      slug={knife.slug ?? ''}
                      title={knife.title}
                      price={knife.price}
                      status={knife.status ?? 'in_stock'}
                      imageUrl={imgUrl}
                      hoverImageUrl={hoverImgUrl}
                      priority={index < 4}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. Custom Order Section ────────────────────── */}
      {customKnives.length > 0 && (
        <section className="bg-[#FAFAF9] py-20 md:py-32 border-b border-black/[0.03]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <AnimatedSection className="flex justify-between items-end mb-10">
              <div>
                <p className="text-label mb-2">Індивідуальні запити</p>
                <h2 className="heading-display text-3xl md:text-4xl">Під замовлення</h2>
              </div>
              <Link
                href="/knives/custom-order"
                className="inline-flex text-[10px] sm:text-xs tracking-widest uppercase items-center gap-2 border-b border-foreground pb-0.5 hover:opacity-50 transition-opacity"
              >
                Дізнатись більше
              </Link>
            </AnimatedSection>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-8">
              {customKnives.map((knife, index) => {
                const firstImage = knife.images?.[0]
                const secondImage = knife.images?.[1]
                const imgUrl =
                  typeof firstImage === 'object' && firstImage !== null
                    ? firstImage.sizes?.thumbnail?.url ||
                      firstImage.sizes?.card?.url ||
                      firstImage.url
                    : null
                const hoverImgUrl =
                  typeof secondImage === 'object' && secondImage !== null
                    ? secondImage.sizes?.thumbnail?.url ||
                      secondImage.sizes?.card?.url ||
                      secondImage.url
                    : null
                return (
                  <div key={knife.id}>
                    <KnifeCard
                      slug={knife.slug ?? ''}
                      title={knife.title}
                      price={knife.price}
                      status={knife.status ?? 'custom'}
                      imageUrl={imgUrl}
                      hoverImageUrl={hoverImgUrl}
                      priority={index < 4}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Featured Manufacturers ──────────────────────── */}
      <section className="bg-white py-20 md:py-32 border-b border-black/[0.03]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <AnimatedSection className="mb-10">
            <p className="text-label mb-3">Клинки цих та інших майстрів доступні для замовлення</p>
            <h2 className="heading-display text-2xl md:text-4xl mb-4 text-left">
              Виробники з топу нашого магазину
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {manufacturers.map((master, i) => (
              <ManufacturerCard key={i} en={master.en} jp={master.jp} delay={i * 0.02} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. User Reviews ─────────────────────────────── */}
      <ReviewsMarquee reviews={reviewUrls} />

      {/* ── 6. Philosophy & Heritage (Immersive Editorial) ─────────── */}
      <section className="bg-white pt-32 md:pt-40 pb-0 flex flex-col gap-10 border-t border-[var(--border)] overflow-hidden relative">
        {/* Heritage Watermark 01: 锻 (Forging) */}
        <div className="absolute left-[-5%] top-[10%] text-[40vw] font-serif opacity-[0.03] select-none pointer-events-none text-black leading-none">
          锻
        </div>

        {/* Section Header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-20">
          <AnimatedSection>
            <p className="text-label mb-3">Вибір починається з розуміння</p>
            <h2 className="heading-display text-4xl md:text-4xl">
              Філософія вибору ножів в нашому магазині
            </h2>
          </AnimatedSection>
        </div>

        {/* Intro & Definition */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-stretch">
            <div className="lg:col-span-5 flex flex-col pt-4 md:pt-8">
              <AnimatedSection variant="fade-in">
                <div className="flex items-center gap-4 mb-10 overflow-hidden">
                  <div className="w-12 h-[1px] bg-[var(--gold)] origin-left animate-width-reveal"></div>
                  <p className="text-[10px] tracking-[0.5em] uppercase text-black/40 font-mono">
                    章 01 / Витоки
                  </p>
                </div>
              </AnimatedSection>

              <div className="space-y-10 font-serif text-lg md:text-[22px] leading-relaxed text-black/80 text-justify">
                <AnimatedSection delay={0.2}>
                  <div className="relative pl-0">
                    <strong className="text-black block mb-2 uppercase text-[10px] tracking-[0.2em] font-sans">
                      Коваль
                    </strong>
                    Майстер, який створює ніж від початку і до кінця. Формування, кування,
                    шліфування, нанесення ієрогліфів - кожен етап проходить через його руки. Це не
                    просто процес, а цілісна робота однієї людини, в яку вкладено досвід, характер і
                    власний підхід.
                  </div>
                </AnimatedSection>
                <AnimatedSection delay={0.3}>
                  <div className="relative pl-0">
                    <strong className="text-black block mb-2 uppercase text-[10px] tracking-[0.2em] font-sans">
                      Фабрика
                    </strong>
                    На фабриці ніж проходить через багато рук - кожен відповідає за окремий етап. Це
                    інший підхід: швидший, стандартизований і передбачуваний за результатом.
                  </div>
                </AnimatedSection>
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7 relative w-full group">
              <AnimatedSection variant="fade-in" delay={0.4} className="h-full">
                <div className="relative aspect-[4/5] h-full min-h-[420px] grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl bg-[#F6F5F2] w-full overflow-hidden border border-black/6 group">
                  <Image
                    src="/images/master1.JPG"
                    alt="Japanese Master Blacksmith at work"
                    fill
                    className="object-cover transition-transform duration-1000"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Internal Editorial Border */}
                  <div className="absolute inset-0 border-[1px] border-white/20 m-6 pointer-events-none z-20" />
                  {/* Bottom Shadow Gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/30 to-transparent z-10" />
                  {/* Texture Overlay */}
                  <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none z-30"></div>
                </div>
              </AnimatedSection>

              {/* Floating label */}
              <div className="absolute -right-8 top-1/2 -rotate-90 hidden lg:block">
                <span className="text-[9px] tracking-[0.5em] uppercase text-black/20 font-mono">
                  Precision Heritage / 1000m altitude
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Heritage Watermark 02: 精 (Precision) */}
        <div className="absolute right-[-10%] top-[40%] text-[50vw] font-serif opacity-[0.02] select-none pointer-events-none text-black leading-none pt-40">
          精
        </div>

        {/* Quality Commission - Cinematic Offset */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-8 items-stretch">
            <div className="lg:col-span-7 order-2 lg:order-1 relative w-full group">
              <AnimatedSection variant="fade-in" className="h-full">
                <div className="relative aspect-[4/5] h-full min-h-[420px] grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl bg-[#F6F5F2] w-full overflow-hidden border border-black/6 group">
                  <Image
                    src="/images/master2.JPG"
                    alt="Japanese Master examining quality"
                    fill
                    className="object-cover transition-transform duration-1000"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Internal Editorial Border */}
                  <div className="absolute inset-0 border-[1px] border-white/20 m-6 pointer-events-none z-20" />
                  {/* Bottom Shadow Gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/30 to-transparent z-10" />
                  {/* Texture Overlay */}
                  <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none z-30"></div>
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-4 lg:col-start-9 order-1 lg:order-2 flex flex-col justify-center">
              <AnimatedSection delay={0.2}>
                <div className="flex items-center gap-4 mb-10 overflow-hidden">
                  <div className="w-12 h-[1px] bg-[var(--gold)] origin-left animate-width-reveal"></div>
                  <p className="text-[10px] tracking-[0.5em] uppercase text-black/40 font-mono">
                    章 02 / Якість
                  </p>
                </div>
                <div className="font-serif text-lg md:text-[22px] leading-relaxed text-black/80 space-y-8 text-justify">
                  <p>
                    В Японії існує комісія, яка контролює якість клинків незалежно від майстерні.
                    Вона задає стандарти, яким має відповідати ніж перед тим, як потрапити до
                    покупця.
                  </p>

                  <p>
                    Це означає, що і фабричні, і авторські ножі проходять контроль та відповідають
                    високим вимогам. Різниця не в якості як такій, а в самому підході до створення.
                  </p>

                  <p>
                    Фабричне виробництво дає стабільність і повторюваність результату. Ручна робота
                    - це індивідуальність і особистий почерк майстра.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>

        {/* Heritage Watermark 03: 匠 (Master) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[10%] text-[60vw] font-serif opacity-[0.015] select-none pointer-events-none text-black leading-none">
          匠
        </div>

        {/* Uniqueness & Art Quotes - Immersive focus */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center relative z-10 pt-4">
          <AnimatedSection delay={0.3}>
            <div className="flex flex-col items-center mb-8">
              <div className="w-[1px] h-20 bg-gradient-to-b from-black/0 via-black/20 to-black/0 mb-8"></div>
              <p className="text-[10px] tracking-[0.5em] uppercase text-black/40 font-mono mb-8">
                章 03 / Унікальність
              </p>
            </div>

            <div className="max-w-6xl mx-auto mb-16 relative">
              <h3 className="font-serif italic text-3xl md:text-4xl lg:text-6xl leading-[1.15] text-black mb-8 pl-2 pr-6 md:px-4 tracking-tight">
                "На мою думку, кожен ніж — унікальний.
                <br />
                <span className="whitespace-nowrap">Кожен коваль — винятковий"</span>
              </h3>
              <div className="flex justify-end pr-4 md:pr-10">
                <p className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-black/40 font-sans translate-y-[-20px]">
                  - Засновник Japanese Kitchen Knives
                </p>
              </div>
            </div>

            <p className="font-serif text-lg md:text-[22px] leading-relaxed text-black/80 mb-16 max-w-3xl mx-auto">
              Кожен майстер застосовує власні знання та техніки, що передаються поколіннями. Саме
              тому кожен ніж має свій характер і не повторюється повністю.
            </p>

            <div className="flex items-center justify-center gap-6 mb-20">
              <div className="w-16 h-[1px] bg-black/10 origin-right transition-transform hover:scale-x-150 duration-700"></div>
              <div className="w-2 h-2 border border-[var(--gold)] rotate-45 group-hover:bg-[var(--gold)] transition-colors duration-700"></div>
              <div className="w-16 h-[1px] bg-black/10 origin-left transition-transform hover:scale-x-150 duration-700"></div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 8. Red Hinomaru CTA Line ────────────────────── */}
      <section className="bg-[#BC002D] text-white py-12 md:py-16 text-center relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-20">
          <AnimatedSection>
            <div className="flex flex-col gap-6 lg:gap-10 justify-center items-center">
              <h2 className="heading-display text-3xl md:text-4xl tracking-tight text-white leading-tight max-w-2xl">
                Оберіть свій ідеальний ніж
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-stretch">
                <Link
                  href="/knives/in-stock"
                  className="w-full sm:w-[220px] inline-flex items-center justify-center px-4 sm:px-8 py-5 bg-white text-[#BC002D] font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[11px] transition-colors duration-300 hover:bg-neutral-100 shadow-lg"
                >
                  Обрати ніж
                </Link>
                <Link
                  href="/knives/custom-order"
                  className="w-full sm:w-[220px] inline-flex items-center justify-center border-2 border-white/40 text-white px-4 sm:px-8 py-5 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[11px] transition-colors duration-300 hover:bg-white/10 shadow-lg"
                >
                  Під замовлення
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

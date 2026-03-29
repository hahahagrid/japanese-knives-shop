export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { KnifeCard } from '@/components/KnifeCard'
import { AnimatedSection } from '@/components/AnimatedSection'

export const metadata = {
  title: 'Ножі під замовлення | K N I V E S',
  description: 'Ексклюзивні японські ножі, які ми привеземо спеціально для вас.',
}

export default async function CustomOrderPage() {
  const payload = await getPayload({ config })

  const { docs: knives } = await payload.find({
    collection: 'knives',
    where: { status: { equals: 'custom_order' } },
    overrideAccess: false,
    depth: 1,
  })

  return (
    <div>
      {/* Top CTA banner */}
      <div className="bg-[#0A0A09] text-white pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        {/* Subtle Background Kanji Pattern */}
        <div className="absolute right-[-5%] top-[50%] -translate-y-1/2 text-[20vw] font-serif opacity-[0.06] select-none pointer-events-none">
          趣
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-500 mb-4 font-bold">
              Індивідуальні Рішення
            </p>
            <h1 className="heading-display text-5xl md:text-6xl lg:text-8xl mb-6">
              Під замовлення
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed font-light italic font-serif">
              Оберіть модель зі списку або опишіть свій ідеальний ніж — конкретну сталь, довжину
              леза, тип рукоятки, улюбленого майстра. Ми знайдемо, привеземо та доставимо шедевр
              спеціально для вас.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 md:py-24">
        <AnimatedSection className="mb-12 border-b border-[var(--border)] pb-8">
          <div className="flex items-end justify-between">
            <h2 className="heading-display text-2xl md:text-3xl">Доступні моделі</h2>
            {knives.length > 0 && (
              <p className="text-sm text-[var(--muted)]">{knives.length} моделей</p>
            )}
          </div>
        </AnimatedSection>

        {knives.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-[var(--muted)] mb-6">Каталог оновлюється.</p>
            <Link
              href="/contacts"
              className="text-xs tracking-widest uppercase border-b border-foreground pb-0.5 hover:opacity-50 transition-opacity"
            >
              Залишити запит
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-8 gap-y-8 sm:gap-y-14 stagger-children">
            {knives.map((knife) => {
              const firstImage = knife.images?.[0]
              const secondImage = knife.images?.[1]
              const imgUrl =
                typeof firstImage === 'object' && firstImage !== null
                  ? (firstImage as { url?: string }).url
                  : null
              const hoverImgUrl =
                typeof secondImage === 'object' && secondImage !== null
                  ? (secondImage as { url?: string }).url
                  : null
              return (
                <div key={knife.id} className="animate-fade-up">
                  <KnifeCard
                    slug={knife.slug ?? ''}
                    title={knife.title}
                    price={knife.price}
                    status={knife.status ?? 'custom_order'}
                    imageUrl={imgUrl}
                    hoverImageUrl={hoverImgUrl}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

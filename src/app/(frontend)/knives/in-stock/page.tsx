export const revalidate = 3600 // 1 hour cache fallback

import { getPayload } from 'payload'
import config from '@payload-config'
import { KnifeCard } from '@/components/KnifeCard'
import { AnimatedSection } from '@/components/AnimatedSection'
import { PageVersion } from '@/components/PageVersion'

export const metadata = {
  title: 'Купити японські ножі в наявності | Преміум клинки в Україні',
  description:
    'Каталог автентичних японських ножів у наявності. Шедеври від Sakai, Sanjo та Echizen. Ручна робота, професійна сталь. Доставка по Україні 1-2 дні. Гарантія оригінальності.',
  openGraph: {
    title: 'Купити японські ножі в наявності | Japanese Kitchen Knives',
    description:
      'Каталог автентичних японських ножів у наявності. Шедеври від Sakai, Sanjo та Echizen. Ручна робота, професійна сталь.',
    url: 'https://japanese-kitchen-knives.com.ua/knives/in-stock',
    siteName: 'Japanese Kitchen Knives',
    images: [{ url: '/images/logo.png', width: 1200, height: 630, alt: 'Japanese Kitchen Knives' }],
    locale: 'uk_UA',
    type: 'website',
  },
}

export default async function InStockPage() {
  const payload = await getPayload({ config })

  const { docs: knives } = await payload.find({
    collection: 'products',
    where: {
      and: [
        { status: { in: ['in_stock', 'sold'] } }, 
        { type: { equals: 'knife' } }
      ],
    },
    overrideAccess: false,
    depth: 1,
    limit: 100,
    sort: 'status', // entries are 'in_stock', then 'sold' (alphabetical: in_stock < sold)
  })

  // Ensure in_stock comes first, then sold (just in case sort: status isn't clear enough or we have custom_order in theory)
  const sortedKnives = [...knives].sort((a, b) => {
    const order: Record<string, number> = { 'in_stock': 0, 'sold': 1 };
    return order[a.status as string] - order[b.status as string];
  })

  return (
    <div className="flex flex-col">
      <PageVersion />
      {/* Hero Banner */}
      <div className="bg-[#0A0A09] text-white pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        {/* Subtle Background Kanji Pattern */}
        <div className="absolute right-[-5%] top-[50%] -translate-y-1/2 text-[20vw] font-serif opacity-[0.06] select-none pointer-events-none">
          刃
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-500 mb-4 font-bold">
              Преміальна Колекція
            </p>
            <h1 className="heading-display text-5xl md:text-6xl lg:text-8xl mb-6">В наявності</h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed font-light italic font-serif">
              Шедеври японської майстерності, відібрані вручну та готові до відправки вже сьогодні.
              Кожен ніж - це історія традицій та досконалого балансу.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 md:py-24">
        {/* Filter/Count Bar */}
        <AnimatedSection className="mb-16 border-b border-[var(--border)] pb-10 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-[var(--accent)]" />
            <h2 className="text-[11px] uppercase tracking-widest font-bold text-neutral-500 italic">
              Весь каталог ({sortedKnives.length})
            </h2>
          </div>
        </AnimatedSection>

        {sortedKnives.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-[var(--muted)]">
              Наразі всі ножі розпродані. Слідкуйте за оновленнями.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-8 gap-y-8 sm:gap-y-14 stagger-children">
            {sortedKnives.map((knife, index) => {
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
                <div key={knife.id} className="animate-fade-up">
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
        )}
      </div>
    </div>
  )
}

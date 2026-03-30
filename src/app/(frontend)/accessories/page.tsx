import { getPayload } from 'payload'
import config from '@payload-config'
import { KnifeCard } from '@/components/KnifeCard'
import { AnimatedSection } from '@/components/AnimatedSection'

export const metadata = {
  title: 'Аксесуари для ножів | K N I V E S',
  description: 'Доглядайте за своїми ножами правильно з нашою колекцією преміальних аксесуарів.',
}

export default async function AccessoriesPage() {
  const payload = await getPayload({ config })

  const { docs: products } = await payload.find({
    collection: 'products',
    where: { type: { equals: 'accessory' } },
    overrideAccess: false,
    depth: 1,
  })

  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <div className="bg-[#0A0A09] text-white pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute right-[-5%] top-[50%] -translate-y-1/2 text-[20vw] font-serif opacity-[0.06] select-none pointer-events-none">
          具
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-500 mb-4 font-bold">
              Догляд та Мастерність
            </p>
            <h1 className="heading-display text-5xl md:text-6xl lg:text-8xl mb-6">Аксесуари</h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed font-light italic font-serif">
              Професійні інструменти для догляду за вашими ножами. Все необхідне, щоб підтримувати 
              досконалу гостроту в одному місці.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 md:py-24">
        {/* Filter/Count Bar */}
        <AnimatedSection className="mb-16 border-b border-[var(--border)] pb-10 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-[var(--gold)]" />
            <h2 className="text-[11px] uppercase tracking-widest font-bold text-neutral-500 italic">
              Весь каталог ({products.length})
            </h2>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] hidden sm:block">
            Сортування: За датою
          </p>
        </AnimatedSection>

        {products.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-[var(--muted)]">
              Наразі аксесуарів немає в наявності. Слідкуйте за оновленнями.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-8 gap-y-8 sm:gap-y-14 stagger-children">
            {products.map((product) => {
              const firstImage = product.images?.[0]
              const secondImage = product.images?.[1]
              const imgUrl =
                typeof firstImage === 'object' && firstImage !== null
                  ? (firstImage as { url?: string }).url
                  : null
              const hoverImgUrl =
                typeof secondImage === 'object' && secondImage !== null
                  ? (secondImage as { url?: string }).url
                  : null
              
              // Note: using /accessories for accessories slug
              return (
                <div key={product.id} className="animate-fade-up">
                  <KnifeCard
                    slug={product.slug ?? ''}
                    title={product.title}
                    price={product.price}
                    status={product.status ?? 'in_stock'}
                    imageUrl={imgUrl}
                    hoverImageUrl={hoverImgUrl}
                    pathPrefix="/accessories"
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

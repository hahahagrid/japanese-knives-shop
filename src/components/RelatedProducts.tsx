import { getPayload } from 'payload'
import config from '@payload-config'
import { KnifeCard } from './KnifeCard'
import { AnimatedSection } from './AnimatedSection'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface RelatedProductsProps {
  type: 'knife' | 'accessory'
}

export async function RelatedProducts({ type }: RelatedProductsProps) {
  const payload = await getPayload({ config })
  
  // If it's a knife page, recommend accessories. If it's an accessory, recommend knives.
  const targetType = type === 'knife' ? 'accessory' : 'knife'
  const title = type === 'knife' ? 'Разом з цим купляють' : 'Цей аксесуар підійде для'
  
  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      and: [
        { type: { equals: targetType } },
        { availability: { equals: 'available' } }
      ]
    },
    limit: 4,
    overrideAccess: false,
    depth: 1,
  })

  if (products.length === 0) return null

  // Randomize a bit by shuffling
  const shuffled = products.sort(() => 0.5 - Math.random())

  return (
    <section className="py-12 border-t border-[var(--border)]">
      <AnimatedSection className="flex justify-between items-end mb-8">
        <div>
          <p className="text-label mb-2">Доповніть свій комплект</p>
          <h2 className="heading-display text-3xl md:text-4xl">{title}</h2>
        </div>
        <Link 
          href={targetType === 'accessory' ? '/accessories' : '/knives/in-stock'} 
          className="inline-flex items-center gap-2 text-[10px] md:text-xs tracking-widest uppercase border-b border-foreground pb-0.5 hover:opacity-50 transition-opacity"
        >
          {targetType === 'accessory' ? 'Всі аксесуари' : 'Всі ножі'} <ArrowRight className="w-3 h-3" />
        </Link>
      </AnimatedSection>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8">
        {shuffled.map((product) => {
          const firstImage = product.images?.[0]
          const secondImage = product.images?.[1]
          const imgUrl = typeof firstImage === 'object' && firstImage !== null
            ? (firstImage.sizes?.thumbnail?.url || firstImage.sizes?.card?.url || firstImage.url)
            : null
          const hoverImgUrl = typeof secondImage === 'object' && secondImage !== null
            ? (secondImage.sizes?.thumbnail?.url || secondImage.sizes?.card?.url || secondImage.url)
            : null
          
          return (
            <div key={product.id}>
              <KnifeCard
                slug={product.slug ?? ''}
                title={product.title}
                price={product.price}
                status={product.status ?? 'in_stock'}
                availability={(product as any).availability ?? 'available'}
                imageUrl={imgUrl}
                hoverImageUrl={hoverImgUrl}
                pathPrefix={product.type === 'accessory' ? '/accessories' : undefined}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

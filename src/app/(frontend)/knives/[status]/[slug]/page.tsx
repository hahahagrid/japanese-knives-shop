export const revalidate = 86400

import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AnimatedSection } from '@/components/AnimatedSection'
import { KnifeGallery } from '@/components/KnifeGallery'
import { RichText } from '@/components/RichText'
import { AddToCartButton } from '@/components/Cart/AddToCartButton'
import { Database } from 'lucide-react'
import { ProductSchema } from '@/components/SEO/ProductSchema'
import { PageVersion } from '@/components/PageVersion'
import { ExpandableSection } from '@/components/ExpandableSection'

import { generateProductDescription } from '@/utils/seo'

// Map UI status to DB status
const statusMap: Record<string, string> = {
  'in-stock': 'in_stock',
  'custom-order': 'custom_order'
}

export async function generateMetadata({ params }: { params: Promise<{ status: string, slug: string }> }) {
  const { status, slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    where: { 
      and: [
        { slug: { equals: decodedSlug } },
        { type: { equals: 'knife' } }
      ]
    },
    depth: 1,
  })

  if (!docs.length) return { title: 'Not Found' }
  const knife = docs[0]
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://japanese-kitchen-knives.com.ua'
  const pageUrl = `${siteUrl}/knives/${status}/${slug}`
  const firstImage = (knife.images as any[])?.[0]
  const ogImageUrl = typeof firstImage === 'object' && firstImage?.url ? firstImage.url : `${siteUrl}/images/hero_knife-1920.webp`
  
  const finalDescription = generateProductDescription(knife as any, 'knife')

  return { 
    title: `${knife.title} | Japanese Kitchen Knives`,
    description: finalDescription,
    openGraph: {
      title: knife.title,
      description: finalDescription,
      url: pageUrl,
      siteName: 'Japanese Kitchen Knives',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 800,
          alt: knife.title,
        },
      ],
      locale: 'uk_UA',
      type: 'website',
    },
  }
}

export default async function KnifePage({ params }: { params: Promise<{ status: string, slug: string }> }) {
  const { status, slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const payload = await getPayload({ config })
  
  const dbStatus = statusMap[status]
  
  if (!dbStatus) {
    notFound()
  }

  const { docs } = await payload.find({
    collection: 'products',
    where: { 
      and: [
        { slug: { equals: decodedSlug } },
        { status: { equals: dbStatus } },
        { type: { equals: 'knife' } }
      ]
    },
    overrideAccess: false,
    depth: 1,
  })

  if (!docs.length) {
    notFound()
  }

  const knife = docs[0]

  // Check description
  const hasDescription = (() => {
    const desc = knife.description as any
    if (!desc) return false
    const children = desc?.root?.children ?? []
    return children.some((node: any) => {
      const text = node?.children?.map((c: any) => c.text ?? '').join('') ?? ''
      return text.trim().length > 0
    })
  })()

  const galleryImages = (knife.images || []).map((img: any) => ({
    image: img,
    id: typeof img === 'object' && img !== null ? img.id : undefined,
  }))

  const specsList = [
    { label: 'Виробник', value: knife.specs?.manufacturer },
    { label: 'Країна', value: knife.specs?.country },
    { label: 'Матеріал / Сталь', value: knife.specs?.steel },
    { label: 'Твердість', value: knife.specs?.hardness, unit: 'HRC' },
    { label: 'Довжина клинка', value: knife.specs?.bladeLength, unit: 'мм' },
    { label: 'Довжина РК', value: knife.specs?.edgeLength, unit: 'мм' },
    { label: "Довжина руків'я", value: knife.specs?.handleLength, unit: 'мм' },
    { label: 'Загальна довжина', value: knife.specs?.totalLength, unit: 'мм' },
    { label: 'Висота клинка', value: knife.specs?.bladeHeight, unit: 'мм' },
    { label: 'Товщина клинка', value: knife.specs?.thickness, unit: 'мм' },
    { label: 'Вага', value: knife.specs?.weight, unit: 'г' },
    { label: 'Обробка клинка', value: knife.specs?.finish },
    { label: 'Кількість шарів', value: knife.specs?.layers },
    { label: "Матеріал руків'я", value: knife.specs?.handleMaterial },
    { label: 'Матеріал больстера', value: knife.specs?.bolster },
    { label: 'Кут загострення', value: knife.specs?.sharpeningAngle, unit: '°' },
  ].filter((item) => item.value)

  const finalDescription = generateProductDescription(knife as any, 'knife')
  
  const isUnavailable = (knife as any).availability === 'unavailable'
  const isCustomOrder = knife.status === 'custom_order'
  
  // Badge text: "Розпродано" for in-stock, "Недоступно" for custom_order
  const unavailableLabel = isCustomOrder ? 'Недоступно' : 'Розпродано'
  const unavailableBadge = isCustomOrder ? 'Тимчасово недоступно' : 'Продано'

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24 pb-16 md:pt-32 md:pb-32">
      <PageVersion />
      <ProductSchema 
        id={String(knife.id)}
        name={knife.title}
        description={finalDescription}
        image={galleryImages[0]?.image?.url}
        price={knife.price || 0}
        url={process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/knives/${status}/${slug}` : `./`}
        availability={isUnavailable ? 'OutOfStock' : (knife.status === 'in_stock' ? 'InStock' : 'PreOrder')}
      />
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-label mb-12">
        <Link href="/" className="hover:text-black transition-colors">
          Головна
        </Link>
        <span className="opacity-30">/</span>
        <Link
          href={knife.status === 'in_stock' ? '/knives/in-stock' : '/knives/custom-order'}
          className="hover:text-black transition-colors"
        >
          {knife.status === 'in_stock' ? 'В наявності' : 'Під замовлення'}
        </Link>
        <span className="opacity-30">/</span>
        <span className="text-black uppercase">{knife.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Left: Gallery */}
        <div className="lg:col-span-7">
          <AnimatedSection>
            <KnifeGallery images={galleryImages} title={knife.title} />
          </AnimatedSection>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5">
          <AnimatedSection delay={0.15} className="flex flex-col">
            <div className="mb-8 lg:mb-12 border-b border-[var(--border)] pb-10">
              <p className="text-label mb-4">
                {isUnavailable ? unavailableLabel : (knife.status === 'in_stock' ? 'В наявності' : 'Доступний під замовлення')}
              </p>
              <h1 className="heading-display text-4xl md:text-5xl lg:text-7xl mb-10 leading-tight">
                {knife.title}
              </h1>
              <p className="text-4xl text-price">
                {isUnavailable 
                  ? unavailableBadge 
                  : (knife.price
                      ? `${knife.price.toLocaleString('uk-UA')} грн`
                      : knife.status === 'custom_order'
                        ? 'Ціна за запитом'
                        : 'Ціна уточнюється')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 md:mb-12">
              <AddToCartButton 
                knife={{
                  id: String(knife.id),
                  slug: knife.slug as string,
                  title: knife.title as string,
                  price: knife.price as number,
                  status: knife.status as string,
                  availability: knife.availability as string,
                  type: 'knife',
                  imageUrl: galleryImages[0]?.image?.url as string | null,
                }} 
              />
              {knife.price && (
                <Link
                  href="/contacts"
                  className="w-full sm:flex-1 text-center bg-white border border-black/10 text-black py-6 px-10 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-stone-50 transition-all active:scale-95"
                >
                  Консультація
                </Link>
              )}
            </div>

            {/* Expandable Content Sections */}
            <div className="mt-8">
              {/* Description */}
              {hasDescription && (
                <ExpandableSection title="Про виріб" id="description">
                  <div className="prose prose-neutral prose-lg max-w-none text-neutral-800 font-serif leading-relaxed">
                    <RichText content={knife.description} />
                  </div>
                </ExpandableSection>
              )}

              {/* Specs Grid */}
              {specsList.length > 0 && (
                <ExpandableSection title="Технічні характеристики" id="specs">
                  <div className="pt-4">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                      {specsList.map((spec, index) => (
                        <div key={index} className="group border-b border-black/5 pb-2">
                          <dt className="text-[10px] uppercase tracking-widest mb-1 text-[#B4B4B0]">
                            {spec.label}
                          </dt>
                          <dd className="text-sm font-medium tracking-tight text-neutral-800">
                            {spec.value}
                            {spec.unit && (
                              <span className="text-[10px] ml-1 text-neutral-400 uppercase tracking-tighter">
                                {spec.unit}
                              </span>
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </ExpandableSection>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}

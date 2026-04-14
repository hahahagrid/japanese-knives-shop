export const revalidate = 86400

import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { AnimatedSection } from '@/components/AnimatedSection'
import { KnifeGallery } from '@/components/KnifeGallery'
import { RichText } from '@/components/RichText'
import { AddToCartButton } from '@/components/Cart/AddToCartButton'
import { ProductSchema } from '@/components/SEO/ProductSchema'
import { PageVersion } from '@/components/PageVersion'
import { StickyProductBar } from '@/components/StickyProductBar'
import { ProductTabs } from '@/components/ProductTabs'
import { RelatedProducts } from '@/components/RelatedProducts'
import { LatestPosts } from '@/components/LatestPosts'

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
      publishedTime: (knife as any).publishedAt ?? undefined,
    },
  }
}

export default async function KnifePage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ status: string, slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { status, slug } = await params
  const { moved } = await searchParams
  const decodedSlug = decodeURIComponent(slug)
  const payload = await getPayload({ config })
  
  const dbStatus = statusMap[status]
  
  if (!dbStatus) {
    notFound()
  }

  // 1. Try to find the knife with the requested status
  let { docs } = await payload.find({
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

  // 2. Smart Redirect Logic: If not found, look for it in ANY status
  if (docs.length === 0) {
    const { docs: foundElsewhere } = await payload.find({
      collection: 'products',
      where: { 
        and: [
          { slug: { equals: decodedSlug } },
          { type: { equals: 'knife' } }
        ]
      },
      overrideAccess: false,
      depth: 0,
    })

    if (foundElsewhere.length > 0) {
      const correctKnife = foundElsewhere[0]
      const correctStatus = Object.entries(statusMap).find(([_, v]) => v === correctKnife.status)?.[0]
      
      if (correctStatus) {
        redirect(`/knives/${correctStatus}/${slug}?moved=1`)
      }
    }
    
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
    <div className="relative">
      <StickyProductBar 
        knife={{
          id: String(knife.id),
          slug: knife.slug as string,
          title: knife.title as string,
          price: knife.price as number,
          status: knife.status as string,
          availability: (knife as any).availability as string,
          type: 'knife',
          imageUrl: galleryImages[0]?.image?.url as string | null,
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24 pb-16 md:pt-32 md:pb-32">
        {moved === '1' && (
          <div className="mb-8 p-6 bg-stone-50 border border-black/5 text-center">
            <p className="text-xs md:text-sm uppercase tracking-widest text-black/60 font-serif italic">
              {knife.status === 'in_stock' 
                ? 'Цей товар знову з&apos;явився в наявності' 
                : 'Цей товар було продано, але ми можемо виготовити його під замовлення'}
            </p>
          </div>
        )}
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
          <Link href="/" className="hover:text-black transition-colors uppercase">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start pb-0">
          {/* Left: Gallery */}
          <div className="order-1 lg:order-1 lg:sticky lg:top-32">
            <KnifeGallery images={galleryImages} title={knife.title} isUnavailable={isUnavailable} />
          </div>

          {/* Right: Info & Primary Actions */}
          <div className="order-2 lg:order-2">
            <AnimatedSection delay={0.15} className="flex flex-col">
              <div className="mb-8 lg:mb-12">
                <p className="text-label mb-4 text-[#B4B4B0] uppercase tracking-[0.2em] font-bold">
                  {isUnavailable ? unavailableLabel : (knife.status === 'in_stock' ? 'В наявності' : 'Доступний під замовлення')}
                </p>
                <h1 className="heading-display text-4xl md:text-5xl lg:text-7xl mb-8 leading-tight">
                  {knife.title}
                </h1>
                <p className="text-2xl md:text-4xl font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-6 md:mb-12">
                  {isUnavailable 
                    ? unavailableBadge 
                    : (knife.price
                        ? `${knife.price.toLocaleString('uk-UA')} грн`
                        : knife.status === 'custom_order'
                          ? 'Ціна за запитом'
                          : 'Ціна уточнюється')}
                </p>
              </div>

              {/* Primary Actions */}
              <div id="main-buy-area" className="flex flex-col sm:flex-row gap-4 mb-12">
                <AddToCartButton 
                  knife={{
                    id: String(knife.id),
                    slug: knife.slug as string,
                    title: knife.title as string,
                    price: knife.price as number,
                    status: knife.status as string,
                    availability: (knife as any).availability as string,
                    type: 'knife',
                    imageUrl: galleryImages[0]?.image?.url as string | null,
                  }} 
                />
                <Link
                  href="/contacts"
                  className="w-full sm:flex-1 text-center bg-white border border-black/10 text-black py-6 px-10 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-stone-50 transition-all active:scale-95"
                >
                  Консультація
                </Link>
              </div>


            </AnimatedSection>
          </div>
        </div>

        {/* Detailed Info Tabs - Full Width */}
        <ProductTabs 
          description={hasDescription ? (
            <div className="prose prose-neutral prose-lg max-w-none text-neutral-800">
              <RichText content={knife.description} />
            </div>
          ) : null}
          specifications={specsList.length > 0 ? (
            <div className="pt-4">
              <dl className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-12">
                {specsList.map((spec, index) => (
                  <div key={index} className="group border-b border-black/5 pb-2">
                    <dt className="text-[11px] uppercase tracking-widest mb-2 text-[#B4B4B0] font-bold">
                      {spec.label}
                    </dt>
                    <dd className="text-base font-medium tracking-tight text-neutral-800">
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
          ) : null}
        />

        {/* Recommendations and Blog */}
        <div className="mt-8 space-y-0">
          <LatestPosts />
          <RelatedProducts type="knife" />
        </div>
      </div>
    </div>
  )
}

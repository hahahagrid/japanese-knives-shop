export const revalidate = 86400

import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    where: { 
      and: [
        { slug: { equals: decodedSlug } },
        { type: { equals: 'accessory' } }
      ]
    },
    depth: 1,
  })

  if (!docs.length) return { title: 'Not Found' }
  const product = docs[0]

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://japanese-kitchen-knives.com.ua'
  const pageUrl = `${siteUrl}/accessories/${slug}`
  const firstImage = (product.images as any[])?.[0]
  const ogImageUrl = typeof firstImage === 'object' && firstImage?.url ? firstImage.url : `${siteUrl}/images/hero_knife-1920.webp`

  const finalDescription = generateProductDescription(product as any, 'accessory')

  return { 
    title: `${product.title} | Japanese Kitchen Knives`,
    description: finalDescription,
    openGraph: {
      title: product.title,
      description: finalDescription,
      url: pageUrl,
      siteName: 'Japanese Kitchen Knives',
      images: [{ url: ogImageUrl, width: 1200, height: 800, alt: product.title }],
      locale: 'uk_UA',
      type: 'website',
    },
  }
}

export default async function AccessoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const payload = await getPayload({ config })
  
  const { docs } = await payload.find({
    collection: 'products',
    where: { 
      and: [
        { slug: { equals: decodedSlug } },
        { type: { equals: 'accessory' } }
      ]
    },
    overrideAccess: false,
    depth: 1,
  })

  if (!docs.length) {
    notFound()
  }

  const product = docs[0]

  // Check description
  const hasDescription = (() => {
    const desc = product.description as any
    if (!desc) return false
    const children = desc?.root?.children ?? []
    return children.some((node: any) => {
      const text = node?.children?.map((c: any) => c.text ?? '').join('') ?? ''
      return text.trim().length > 0
    })
  })()

  const galleryImages = (product.images || []).map((img: any) => ({
    image: img,
    id: typeof img === 'object' && img !== null ? img.id : undefined,
  }))

  const specsList = [
    { label: 'Виробник', value: product.specs?.manufacturer },
    { label: 'Країна', value: product.specs?.country },
    { label: 'Матеріал', value: product.specs?.steel },
    { label: 'Довжина', value: product.specs?.totalLength, unit: 'мм' },
    { label: 'Вага', value: product.specs?.weight, unit: 'г' },
  ].filter((item) => item.value)

  const finalDescription = generateProductDescription(product as any, 'accessory')
  const isUnavailable = (product as any).availability === 'unavailable'

  return (
    <div className="relative">
      <StickyProductBar 
        knife={{
          id: String(product.id),
          slug: product.slug as string,
          title: product.title as string,
          price: product.price as number,
          status: product.status as string,
          availability: (product as any).availability as string,
          type: 'accessory',
          imageUrl: galleryImages[0]?.image?.url as string | null,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24 pb-16 md:pt-32 md:pb-32">
        <PageVersion />
        <ProductSchema 
          id={String(product.id)}
          name={product.title}
          description={finalDescription}
          image={galleryImages[0]?.image?.url}
          price={product.price || 0}
          url={process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/accessories/${slug}` : `./`}
          availability={isUnavailable ? 'OutOfStock' : 'InStock'}
        />

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-label mb-12">
          <Link href="/" className="hover:text-black transition-colors uppercase">
            Головна
          </Link>
          <span className="opacity-30">/</span>
          <Link
            href="/accessories"
            className="hover:text-black transition-colors uppercase"
          >
            Аксесуари
          </Link>
          <span className="opacity-30">/</span>
          <span className="text-black uppercase">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start pb-0">
          {/* Left: Gallery */}
          <div className="order-1 lg:order-1 lg:sticky lg:top-32">
            <KnifeGallery images={galleryImages} title={product.title} isUnavailable={isUnavailable} />
          </div>

          {/* Right: Info & Primary Actions */}
          <div className="order-2 lg:order-2">
            <AnimatedSection delay={0.15} className="flex flex-col">
              <div className="mb-8 lg:mb-12">
                <p className="text-label mb-4 text-[#B4B4B0] uppercase tracking-[0.2em] font-bold">
                  Аксесуар
                </p>
                <h1 className="heading-display text-4xl md:text-5xl lg:text-7xl mb-8 leading-tight">
                  {product.title}
                </h1>
                <p className="text-2xl md:text-4xl font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-6 md:mb-12">
                  {isUnavailable 
                    ? 'Продано' 
                    : (product.price
                        ? `${product.price.toLocaleString('uk-UA')} грн`
                        : 'Ціна уточнюється')}
                </p>
              </div>

              {/* Primary Actions */}
              <div id="main-buy-area" className="flex flex-col sm:flex-row gap-4 mb-12">
                <AddToCartButton 
                  knife={{
                    id: String(product.id),
                    slug: product.slug as string,
                    title: product.title as string,
                    price: product.price as number,
                    status: product.status as string,
                    availability: (product as any).availability as string,
                    type: 'accessory',
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
              <RichText content={product.description} />
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
          <RelatedProducts type="accessory" />
        </div>
      </div>
    </div>
  )
}

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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24 pb-16 md:pt-32 md:pb-32">
      <PageVersion />
      <ProductSchema 
        id={String(product.id)}
        name={product.title}
        description={finalDescription}
        image={galleryImages[0]?.image?.url}
        price={product.price || 0}
        url={process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/accessories/${slug}` : `./`}
        availability="InStock"
      />
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-12">
        <Link href="/" className="hover:text-black transition-colors">
          Головна
        </Link>
        <span className="opacity-30">/</span>
        <Link
          href="/accessories"
          className="hover:text-black transition-colors"
        >
          Аксесуари
        </Link>
        <span className="opacity-30">/</span>
        <span className="text-black font-semibold">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Left: Gallery */}
        <div className="lg:col-span-7">
          <AnimatedSection>
            <KnifeGallery images={galleryImages} title={product.title} />
          </AnimatedSection>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5">
          <AnimatedSection delay={0.15} className="flex flex-col">
            <div className="mb-10 lg:mb-14 border-b border-[var(--border)] pb-10">
              <p className="text-[11px] tracking-[0.4em] uppercase text-[var(--muted)] mb-4 italic font-medium">
                Аксесуар
              </p>
              <h1 className="heading-display text-4xl md:text-5xl lg:text-7xl mb-10 leading-tight">
                {product.title}
              </h1>
              <p className="text-4xl text-price">
                {product.price
                  ? `${product.price.toLocaleString('uk-UA')} грн`
                  : 'Ціна за запитом'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-5 mb-14">
              <AddToCartButton 
                knife={{
                  id: String(product.id),
                  slug: product.slug as string,
                  title: product.title as string,
                  price: product.price as number,
                  status: product.status as string,
                  type: 'accessory',
                  imageUrl: galleryImages[0]?.image?.url as string | null,
                }} 
              />
              <Link
                href="/contacts"
                className="flex-1 text-center bg-white border border-black/10 text-black py-6 px-10 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-stone-50 transition-all active:scale-95"
              >
                Консультація
              </Link>
            </div>

            {/* Description */}
            {hasDescription && (
              <div className="mb-14">
                <h2 className="text-[11px] uppercase tracking-widest font-bold text-neutral-400 mb-6 italic border-l-2 border-[var(--accent)] pl-4">
                  Про виріб
                </h2>
                <div className="prose prose-neutral prose-md max-w-none leading-relaxed text-neutral-700 font-light">
                  <RichText content={product.description} className="text-lg" />
                </div>
              </div>
            )}

            {/* Specs Grid */}
            {specsList.length > 0 && (
              <div className="mb-16 border-t border-[var(--border)] pt-12">
                <div className="flex items-center gap-3 mb-10">
                  <h2 className="text-[11px] uppercase tracking-widest font-bold text-neutral-400 italic">
                    Технічні характеристики
                  </h2>
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                  {specsList.map((spec, index) => (
                    <div key={index} className="group border-b border-black/5 pb-2">
                      <dt className="text-[10px] uppercase tracking-widest text-[#B4B4B0] mb-2">
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
            )}
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}

import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AnimatedSection } from '@/components/AnimatedSection'
import { KnifeGallery } from '@/components/KnifeGallery'
import { RichText } from '@/components/RichText'
import { AddToCartButton } from '@/components/Cart/AddToCartButton'
import { Database } from 'lucide-react'

// Map UI status to DB status
const statusMap: Record<string, string> = {
  'in-stock': 'in_stock',
  'custom-order': 'custom_order'
}

export async function generateMetadata({ params }: { params: Promise<{ status: string, slug: string }> }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'knives',
    where: { slug: { equals: decodedSlug } },
  })
  if (!docs.length) return { title: 'Not Found' }
  return { title: `${docs[0].title} | K N I V E S` }
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
    collection: 'knives',
    where: { 
      and: [
        { slug: { equals: decodedSlug } },
        { status: { equals: dbStatus } }
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24 pb-16 md:pt-32 md:pb-32">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-12">
        <Link href="/" className="hover:text-black transition-colors">
          Головна
        </Link>
        <span className="opacity-30">/</span>
        <Link
          href={dbStatus === 'in_stock' ? '/knives/in-stock' : '/knives/custom-order'}
          className="hover:text-black transition-colors"
        >
          {dbStatus === 'in_stock' ? 'В наявності' : 'Під замовлення'}
        </Link>
        <span className="opacity-30">/</span>
        <span className="text-black font-semibold">{knife.title}</span>
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
            <div className="mb-10 lg:mb-14 border-b border-[var(--border)] pb-10">
              <p className="text-[11px] tracking-[0.4em] uppercase text-[var(--muted)] mb-4 italic font-medium">
                {dbStatus === 'in_stock' ? 'В наявності' : 'Доступний під замовлення'}
              </p>
              <h1 className="heading-display text-4xl md:text-5xl lg:text-7xl mb-10 leading-tight">
                {knife.title}
              </h1>
              <p className="text-4xl font-serif italic text-[var(--gold)]">
                {knife.price
                  ? `${knife.price.toLocaleString('uk-UA')} грн`
                  : dbStatus === 'custom_order'
                    ? 'Ціна за запитом'
                    : 'Ціна уточнюється'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-5 mb-14">
              <AddToCartButton 
                knife={{
                  id: String(knife.id),
                  slug: knife.slug as string,
                  title: knife.title as string,
                  price: knife.price as number,
                  status: knife.status as string,
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
                <h3 className="text-[11px] uppercase tracking-widest font-bold text-neutral-400 mb-6 italic border-l-2 border-[var(--gold)] pl-4">
                  Про виріб
                </h3>
                <div className="prose prose-neutral prose-md max-w-none leading-relaxed text-neutral-700 font-light">
                  <RichText content={knife.description} className="text-lg" />
                </div>
              </div>
            )}

            {/* Specs Grid */}
            {specsList.length > 0 && (
              <div className="mb-16 border-t border-[var(--border)] pt-12">
                <div className="flex items-center gap-3 mb-10">
                  <Database className="w-4 h-4 text-[var(--gold)]" />
                  <h3 className="text-[11px] uppercase tracking-widest font-bold text-neutral-500 italic">
                    Технічні характеристики
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                  {specsList.map((spec, index) => (
                    <div key={index} className="group border-b border-black/5 pb-2">
                      <dt className="text-[10px] uppercase tracking-widest text-[#B4B4B0] mb-2 italic">
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
                </div>
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}

import Image from 'next/image'
import Link from 'next/link'

interface KnifeCardProps {
  slug: string
  title: string
  price?: number | null
  status?: string
  imageUrl?: string | null
  hoverImageUrl?: string | null
  pathPrefix?: string
  priority?: boolean
}

export function KnifeCard({ slug, title, price, status, imageUrl, hoverImageUrl, pathPrefix, priority }: KnifeCardProps) {
  const statusPath = status === 'in_stock' ? 'in-stock' : 'custom-order'
  const href = pathPrefix ? `${pathPrefix}/${slug}` : `/knives/${statusPath}/${slug}`
  
  return (
    <Link href={href} className="group flex flex-col">
      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden relative mb-5">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={title}
              fill
              unoptimized
              priority={priority}
              {...(priority ? { fetchPriority: "high" } : {})}
              className={`object-cover transition-all duration-1000 ease-out-expo group-hover:scale-[1.05] will-change-transform ${
                hoverImageUrl ? 'md:group-hover:opacity-0' : ''
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {hoverImageUrl && (
              <Image
                src={hoverImageUrl}
                alt={`${title} - view 2`}
                fill
                unoptimized
                loading="lazy"
                className="hidden md:block object-cover transition-all duration-1000 ease-out-expo opacity-0 group-hover:opacity-100 group-hover:scale-[1.05] will-change-transform"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-neutral-100" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2">
        <h3 className="font-serif font-bold text-[1.1rem] leading-snug transition-opacity duration-300 group-hover:opacity-60">
          {title}
        </h3>
        <p className="text-metadata">
          {price 
            ? `${price.toLocaleString('uk-UA')} грн`
            : (status === 'custom_order' ? 'Ціна за запитом' : 'Ціна уточнюється')}
        </p>
      </div>
    </Link>
  )
}

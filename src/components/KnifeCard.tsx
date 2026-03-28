import Image from 'next/image'
import Link from 'next/link'

interface KnifeCardProps {
  slug: string
  title: string
  price?: number | null
  status?: string
  imageUrl?: string | null
}

export function KnifeCard({ slug, title, price, status, imageUrl }: KnifeCardProps) {
  return (
    <Link href={`/knives/${slug}`} className="group flex flex-col">
      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden relative mb-5">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.05] will-change-transform"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-100" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2">
        <h2 className="font-serif font-bold text-[1.1rem] leading-snug transition-opacity duration-300 group-hover:opacity-60">
          {title}
        </h2>
        <p className="text-[13px] tracking-widest uppercase text-[var(--muted)] font-medium">
          {price 
            ? `${price.toLocaleString('uk-UA')} грн`
            : (status === 'custom_order' ? 'Ціна за запитом' : 'Ціна уточнюється')}
        </p>
      </div>
    </Link>
  )
}

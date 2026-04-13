'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface KnifeCardProps {
  slug: string
  title: string
  price?: number | null
  status?: string
  availability?: string
  imageUrl?: string | null
  hoverImageUrl?: string | null
  pathPrefix?: string
  priority?: boolean
}

export function KnifeCard({ slug, title, price, status, availability, imageUrl, hoverImageUrl, pathPrefix, priority }: KnifeCardProps) {
  const [canHover, setCanHover] = useState(false)
  
  useEffect(() => {
    // Detect if device supports hover (Desktop)
    if (typeof window !== 'undefined') {
      setCanHover(window.matchMedia('(hover: hover)').matches)
    }
  }, [])

  const isUnavailable = availability === 'unavailable'
  const statusPath = status === 'in_stock' ? 'in-stock' : 'custom-order'
  const href = pathPrefix ? `${pathPrefix}/${slug}` : `/knives/${statusPath}/${slug}`
  
  // Badge text logic: "Продано" for in-stock/accessories, "Недоступно" for custom order
  const badgeText = status === 'custom_order' ? 'Недоступно' : 'Продано'
  
  return (
    <Link href={href} className={`group flex flex-col ${isUnavailable ? 'opacity-70' : ''}`}>
      {/* Image Container */}
      <div className={`aspect-[4/5] overflow-hidden relative mb-5 bg-neutral-100 ${isUnavailable ? 'grayscale' : ''}`}>
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={title}
              fill
              priority={priority}
              {...(priority ? { fetchPriority: "high" } : {})}
              className={`object-cover transition-all duration-1000 ease-out-expo will-change-transform ${
                canHover && !isUnavailable ? 'group-hover:scale-[1.05]' : ''
              } ${
                canHover && hoverImageUrl && !isUnavailable ? 'md:group-hover:opacity-0' : 'opacity-100'
              }`}
              sizes="(max-width: 767px) calc((100vw - 48px) / 2), (max-width: 1024px) 33vw, 25vw"
              quality={45}
            />
            {/* Only render hover image for desktop to save mobile bandwidth */}
            {canHover && hoverImageUrl && !isUnavailable && (
              <Image
                src={hoverImageUrl}
                alt={`${title} - view 2`}
                fill
                className="hidden md:block object-cover transition-all duration-1000 ease-out-expo opacity-0 group-hover:opacity-100 group-hover:scale-[1.05] will-change-transform"
                sizes="(max-width: 767px) calc((100vw - 48px) / 2), (max-width: 1024px) 33vw, 25vw"
                quality={45}
              />
            )}
            
            {/* Availability Badge */}
            {isUnavailable && (
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] uppercase">
                  {badgeText}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-neutral-100" />
        )}
      </div>

      {/* Info Container */}
      <div className="flex flex-col gap-2">
        <h3 className={`font-serif font-bold text-[1.1rem] leading-snug transition-opacity duration-300 ${!isUnavailable ? 'group-hover:opacity-60' : ''}`}>
          {title}
        </h3>
        <p className={`text-metadata ${isUnavailable ? 'text-neutral-400' : ''}`}>
          {isUnavailable 
            ? badgeText 
            : (price 
                ? `${price.toLocaleString('uk-UA')} грн`
                : (status === 'custom_order' ? 'Ціна за запитом' : 'Ціна уточнюється'))}
        </p>
      </div>
    </Link>
  )
}

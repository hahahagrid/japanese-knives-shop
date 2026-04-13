'use client'

import { useState, useEffect, useRef } from 'react'
import { AddToCartButton } from '@/components/Cart/AddToCartButton'
import Link from 'next/link'

interface StickyProductBarProps {
  knife: {
    id: string
    slug: string
    title: string
    price: number
    status: string
    availability?: string
    imageUrl: string | null
    type?: 'knife' | 'accessory'
  }
}

export function StickyProductBar({ knife }: StickyProductBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // We use Intersection Observer to detect when the main buy area is covered by the header
    // Header height is 80px, so we set a rootMargin of -80px from the top.
    const target = document.getElementById('main-buy-area')
    
    if (target) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          // If not intersecting and the target is ABOVE the threshold (meaning it went under the header)
          const isAbove = entry.boundingClientRect.top < 80
          setIsVisible(!entry.isIntersecting && isAbove)
        },
        {
          // Monitor visibility relative to the area below the header
          rootMargin: '-80px 0px 1000px 0px', 
          threshold: 0
        }
      )
      
      observerRef.current.observe(target)
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [])

  return (
    <div 
      className={`fixed top-[80px] left-0 w-full bg-white/95 backdrop-blur-md z-[48] border-b border-[var(--border)] transition-all duration-700 ease-out-expo ${
        isVisible 
          ? 'translate-y-0 opacity-100 visible' 
          : '-translate-y-full opacity-0 invisible pointer-events-none'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-20 md:h-24 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="hidden sm:block h-12 w-12 relative flex-shrink-0 bg-stone-100 p-1">
             {knife.imageUrl && (
               <img 
                 src={knife.imageUrl} 
                 alt={knife.title} 
                 className="w-full h-full object-cover"
               />
             )}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-serif font-bold italic text-base md:text-lg truncate max-w-[150px] md:max-w-md leading-tight">
              {knife.title}
            </h3>
            <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[var(--accent)]">
              {knife.price ? `${knife.price.toLocaleString('uk-UA')} грн` : (knife.status === 'custom_order' ? 'Під замовлення' : 'Ціна уточнюється')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AddToCartButton 
            knife={knife} 
            className="flex items-center justify-center gap-3 bg-black text-white py-4 px-6 md:py-6 md:px-10 font-bold uppercase tracking-[0.2em] text-[11px] whitespace-nowrap transition-all shadow-xl shadow-black/10 active:scale-95 group/btn relative overflow-hidden"
          />
          <Link
            href="/contacts"
            className="hidden lg:flex h-[60px] items-center justify-center px-8 border border-black/10 text-black font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-stone-50 transition-all"
          >
            Консультація
          </Link>
        </div>
      </div>
    </div>
  )
}

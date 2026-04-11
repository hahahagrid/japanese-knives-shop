'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

interface MediaFile {
  url?: string
  width?: number
  height?: number
  alt?: string
  sizes?: {
    thumbnail?: { url: string }
    card?: { url: string }
    tablet?: { url: string }
  }
}

interface KnifeGalleryProps {
  images: Array<{
    image: string | MediaFile
    id?: string
  }>
  title: string
}

export function KnifeGallery({ images, title }: KnifeGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [canPrefetch, setCanPrefetch] = useState(false)

  // After page loads, silently prefetch all zoom images via Next.js optimizer
  // This turns ~1.5MB originals into ~150-200KB WebP cached in the browser
  useEffect(() => {
    const doPrefetch = () => {
      // Just set a flag to render the hidden prefetch images
      // This is more reliable as Next.js handles the same URL generation
      setCanPrefetch(true)
    }

    let idleHandle: number | undefined
    const scheduleAfterLoad = () => {
      if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
        idleHandle = window.requestIdleCallback(doPrefetch, { timeout: 3000 })
      } else {
        idleHandle = window.setTimeout(doPrefetch, 1000) as unknown as number
      }
    }

    if (document.readyState === 'complete') {
      // Page already fully loaded (e.g. navigated via client-side routing)
      scheduleAfterLoad()
    } else {
      window.addEventListener('load', scheduleAfterLoad, { once: true })
    }

    return () => {
      window.removeEventListener('load', scheduleAfterLoad)
      if (idleHandle !== undefined) {
        if (typeof window.cancelIdleCallback === 'function') {
          window.cancelIdleCallback(idleHandle)
        } else {
          window.clearTimeout(idleHandle)
        }
      }
    }
  }, [images])

  if (!images || images.length === 0) return null

  const activeImage = images[activeIndex]?.image
  const activeUrl = typeof activeImage === 'object' ? activeImage.url : null
  const activeAlt = typeof activeImage === 'object' ? activeImage.alt : title

  const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image View */}
      <div 
        className="relative aspect-[4/5] overflow-hidden group cursor-zoom-in bg-neutral-100"
        onClick={() => setIsZoomed(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0"
          >
              {activeUrl && (
                <Image
                  src={activeUrl}
                  alt={activeAlt || title}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out lg:hover:scale-105 will-change-transform"
                  priority={activeIndex === 0}
                  {...(activeIndex === 0 ? { fetchPriority: "high" } : {})}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 600px"
                  quality={activeIndex === 0 ? 65 : (typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 65)}
                />
              )}
          </motion.div>
        </AnimatePresence>

        {/* Overlay Navigation Arrows */}
        {images.length > 1 && (
          <div className="absolute inset-x-3 sm:inset-x-6 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none transition-all duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="p-3 bg-white/80 backdrop-blur-md border border-[var(--border)] rounded-full pointer-events-auto hover:bg-white transition-all shadow-md active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="p-3 bg-white/80 backdrop-blur-md border border-[var(--border)] rounded-full pointer-events-auto hover:bg-white transition-all shadow-md active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails Flex */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2 md:gap-3">
          {images.map((img, i) => {
            const thumbUrl = typeof img.image === 'object' ? img.image.url : img.image
            return (
              <button
                key={img.id || i}
                onClick={() => setActiveIndex(i)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border overflow-hidden transition-all duration-300 ${
                  activeIndex === i 
                    ? 'border-[var(--gold)] scale-[1.02] z-10 shadow-sm' 
                    : 'border-black/5 opacity-60 hover:opacity-100'
                }`}
              >
                {thumbUrl && (
                  <Image
                    src={thumbUrl as string}
                    alt={`${title} - Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80px, 120px"
                    quality={50}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Full-screen Zoom Modal */}
      <AnimatePresence>
      {isZoomed && activeUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-xl flex items-center justify-center cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full h-full p-4 md:p-12 flex items-center justify-center"
            >
              <div className="relative w-full h-full max-w-[90vw] max-h-[90vh]">
                <Image
                  src={activeUrl as string}
                  alt={activeAlt || title}
                  fill
                  loading="lazy"
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 1440px"
                  quality={typeof window !== 'undefined' && window.innerWidth < 768 ? 75 : 80}
                />
              </div>
            </motion.div>
            
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-10 right-10 p-4 bg-black/5 rounded-full hover:bg-black/10 transition-colors shadow-sm"
              aria-label="Close zoom"
            >
              <X className="w-8 h-8 text-black/60" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Prefetch Layer - Hidden, runs after page is idle */}
      {canPrefetch && (
        <div className="hidden pointer-events-none opacity-0" aria-hidden="true">
          {images.map((img, i) => {
            const url = typeof img.image === 'object' ? img.image.url : null
            if (!url || i === 0) return null 
            return (
              <React.Fragment key={i}>
                {/* Prefetch for Gallery View */}
                <Image
                  src={url}
                  alt="prefetch"
                  width={828}
                  height={1035}
                  priority={false}
                  quality={typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 65}
                />
                {/* Prefetch for Zoom View */}
                <Image
                  src={url}
                  alt="prefetch-zoom"
                  width={1440}
                  height={1800}
                  priority={false}
                  quality={typeof window !== 'undefined' && window.innerWidth < 768 ? 75 : 80}
                />
              </React.Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}

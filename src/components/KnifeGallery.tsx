'use client'

import React, { useState, useEffect } from 'react'
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
    const [canPrefetchUrgent, setCanPrefetchUrgent] = useState(false)
    const [canPrefetchIdle, setCanPrefetchIdle] = useState(false)

    useEffect(() => {
      let idleHandle: number | undefined
      let urgentTimeout: number | undefined

      const doPrefetchUrgent = () => setCanPrefetchUrgent(true)
      const doPrefetchIdle = () => setCanPrefetchIdle(true)

      const scheduleAfterLoad = () => {
        // Stage 1: Urgent prefetch for the NEXT image (index 1) after 500ms
        urgentTimeout = window.setTimeout(doPrefetchUrgent, 500)

        // Stage 2: Idle prefetch for everything else
        if (typeof window.requestIdleCallback === 'function') {
          idleHandle = window.requestIdleCallback(doPrefetchIdle, { timeout: 4000 })
        } else {
          idleHandle = window.setTimeout(doPrefetchIdle, 2000) as unknown as number
        }
      }

      if (document.readyState === 'complete') {
        scheduleAfterLoad()
      } else {
        window.addEventListener('load', scheduleAfterLoad, { once: true })
      }

      return () => {
        window.removeEventListener('load', scheduleAfterLoad)
        if (urgentTimeout) window.clearTimeout(urgentTimeout)
        if (idleHandle !== undefined) {
          if (typeof window.cancelIdleCallback === 'function') {
            window.cancelIdleCallback(idleHandle)
          } else {
            window.clearTimeout(idleHandle)
          }
        }
      }
    }, [images])

  // Scroll Lock when zoomed
  useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isZoomed])

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
                  quality={activeIndex === 0 
                    ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 55 : 65) 
                    : (typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 65)}
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
            className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-xl flex items-center justify-center cursor-zoom-out touch-pinch-zoom overscroll-none"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full h-full p-4 md:p-12 flex items-center justify-center pointer-events-none"
            >
              <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full flex items-center justify-center p-4"
                  >
                    <Image
                      src={activeUrl as string}
                      alt={activeAlt || title}
                      fill
                      loading="lazy"
                      className="object-contain pointer-events-auto"
                      sizes="100vw"
                      quality={typeof window !== 'undefined' && window.innerWidth < 768 ? 75 : 85}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Modal Navigation Arrows */}
            {images.length > 1 && (
              <div className="absolute inset-x-4 md:inset-x-10 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-[110]">
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="p-4 md:p-6 bg-black/5 hover:bg-black/10 backdrop-blur-md rounded-full pointer-events-auto transition-all active:scale-90"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 text-black/40" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="p-4 md:p-6 bg-black/5 hover:bg-black/10 backdrop-blur-md rounded-full pointer-events-auto transition-all active:scale-90"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8 md:w-10 md:h-10 text-black/40" />
                </button>
              </div>
            )}
            
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-6 right-6 md:top-10 md:right-10 p-4 bg-black/5 rounded-full hover:bg-black/10 transition-colors shadow-sm z-[110]"
              aria-label="Close zoom"
            >
              <X className="w-8 h-8 text-black/60" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Prefetch Layer - URGEANT (Index 1) */}
      {canPrefetchUrgent && images[1] && (
        <div className="hidden pointer-events-none opacity-0" aria-hidden="true">
          {(() => {
            const url = typeof images[1].image === 'object' ? images[1].image.url : null
            if (!url) return null
            return (
              <Image
                src={url}
                alt="prefetch-urgent"
                width={828}
                height={1035}
                priority={false}
                quality={typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 65}
              />
            )
          })()}
        </div>
      )}

      {/* Background Prefetch Layer - IDLE (Index 2+ and Zoom) */}
      {canPrefetchIdle && (
        <div className="hidden pointer-events-none opacity-0" aria-hidden="true">
          {images.map((img, i) => {
            const url = typeof img.image === 'object' ? img.image.url : null
            if (!url) return null 
            return (
              <React.Fragment key={i}>
                {/* Prefetch for Gallery View (excluding the ones already handled) */}
                {i > 1 && (
                  <Image
                    src={url}
                    alt="prefetch"
                    width={828}
                    height={1035}
                    priority={false}
                    quality={typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 65}
                  />
                )}
                {/* Prefetch for Zoom View (all images) */}
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

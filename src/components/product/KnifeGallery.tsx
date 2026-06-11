'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

interface MediaFile {
  url?: string
  width?: number
  height?: number
  alt?: string
  blurDataUrl?: string | null
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
  isUnavailable?: boolean
}

export function KnifeGallery({ images, title, isUnavailable }: KnifeGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const mainViewRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Warm the browser cache with the EXACT /_next/image URLs the gallery will
  // request: take the rendered image's currentSrc (which already reflects the
  // viewport, DPR and quality) and only swap the source file. Stage 1 fetches
  // the next slide shortly after load, stage 2 fetches the rest when idle.
  useEffect(() => {
    if (images.length < 2) return

    let cancelled = false
    let idleHandle: number | undefined
    let urgentTimeout: number | undefined

    const prefetch = (indices: number[]) => {
      if (cancelled) return
      const template = mainViewRef.current?.querySelector('img')?.currentSrc
      if (!template || !template.includes('/_next/image')) return
      for (const index of indices) {
        const image = images[index]?.image
        const target = typeof image === 'object' ? image.url : null
        if (!target) continue
        const prefetchUrl = new URL(template, window.location.origin)
        prefetchUrl.searchParams.set('url', target)
        new window.Image().src = prefetchUrl.toString()
      }
    }

    const scheduleAfterLoad = () => {
      urgentTimeout = window.setTimeout(() => prefetch([1]), 500)

      const rest = images.map((_, i) => i).filter((i) => i > 1)
      if (rest.length === 0) return
      if (typeof window.requestIdleCallback === 'function') {
        idleHandle = window.requestIdleCallback(() => prefetch(rest), { timeout: 4000 })
      } else {
        idleHandle = window.setTimeout(() => prefetch(rest), 2000) as unknown as number
      }
    }

    if (document.readyState === 'complete') {
      scheduleAfterLoad()
    } else {
      window.addEventListener('load', scheduleAfterLoad, { once: true })
    }

    return () => {
      cancelled = true
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
  const activeBlur = typeof activeImage === 'object' ? activeImage.blurDataUrl : null

  const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image View */}
      <div
        ref={mainViewRef}
        className="relative aspect-[4/5] overflow-hidden group cursor-zoom-in bg-neutral-100"
        onClick={() => setIsZoomed(true)}
      >
        {/* No mode="wait": the layers are absolutely positioned, so the new
            image crossfades over the old one instead of flashing the empty
            background between slides */}
        <AnimatePresence>
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
                  sizes="(max-width: 1023px) calc(100vw - 32px), 750px"
                  quality={75}
                  {...(activeBlur ? { placeholder: 'blur' as const, blurDataURL: activeBlur } : {})}
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
            const thumbUrl =
              typeof img.image === 'object'
                ? img.image.sizes?.thumbnail?.url || img.image.url
                : img.image
            return (
              <button
                key={img.id || i}
                onClick={() => setActiveIndex(i)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border overflow-hidden transition-all duration-300 ${
                  activeIndex === i 
                    ? 'border-[var(--accent)] scale-[1.02] z-10 shadow-sm' 
                    : 'border-black/5 opacity-60 hover:opacity-100'
                }`}
              >
                {thumbUrl && (
                  <Image
                    src={thumbUrl as string}
                    alt={`${title} - Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                    quality={65}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Full-screen Zoom Modal - Portal to Body for top-level z-index */}
      {mounted && createPortal(
        <AnimatePresence>
          {isZoomed && activeUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-white/98 backdrop-blur-xl flex items-center justify-center cursor-zoom-out touch-pinch-zoom overscroll-none"
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
                        quality={85}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Modal Navigation Arrows */}
              {images.length > 1 && (
                <div className="absolute inset-x-3 sm:inset-x-6 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-[10000]">
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="p-3 bg-white/80 backdrop-blur-md border border-[var(--border)] rounded-full pointer-events-auto hover:bg-white transition-all shadow-md active:scale-95"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-black" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="p-3 bg-white/80 backdrop-blur-md border border-[var(--border)] rounded-full pointer-events-auto hover:bg-white transition-all shadow-md active:scale-95"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-black" />
                  </button>
                </div>
              )}
              
              <div className="absolute top-4 right-4 md:top-8 md:right-8 z-[10000]">
                <button
                  onClick={() => setIsZoomed(false)}
                  className="p-3 bg-white/80 backdrop-blur-md border border-[var(--border)] rounded-full hover:bg-white transition-all shadow-md active:scale-95"
                  aria-label="Close zoom"
                >
                  <X className="w-5 h-5 text-black" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  )
}

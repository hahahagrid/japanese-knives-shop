'use client'

import { useState } from 'react'
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

  if (!images || images.length === 0) return null

  const activeImage = images[activeIndex]?.image
  const activeUrl = typeof activeImage === 'object' 
    ? (activeImage.sizes?.tablet?.url || activeImage.url) 
    : null
  const activeAlt = typeof activeImage === 'object' ? activeImage.alt : title
  const fullResUrl = typeof activeImage === 'object' ? activeImage.url : null

  const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image View */}
      <div 
        className="relative aspect-[4/5] overflow-hidden group cursor-zoom-in"
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
                className="object-cover transition-transform duration-1000 ease-out hover:scale-105 will-change-transform"
                priority={activeIndex === 0}
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Overlay Navigation Arrows */}
        {images.length > 1 && (
          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="p-3 bg-white/90 backdrop-blur-md border border-[var(--border)] rounded-full pointer-events-auto hover:bg-white transition-all shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="p-3 bg-white/90 backdrop-blur-md border border-[var(--border)] rounded-full pointer-events-auto hover:bg-white transition-all shadow-lg"
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
            const thumbUrl = typeof img.image === 'object' 
              ? (img.image.sizes?.thumbnail?.url || img.image.url) 
              : null
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
                    src={thumbUrl}
                    alt={`${title} - Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Full-screen Zoom Modal */}
      <AnimatePresence>
        {isZoomed && fullResUrl && (
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
                  src={fullResUrl}
                  alt={activeAlt || title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  quality={90}
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
    </div>
  )
}

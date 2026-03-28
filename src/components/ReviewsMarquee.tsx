'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useAnimationFrame, useMotionValue, wrap } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import Image from 'next/image'

// Temporary colors to simulate photos touching each other
// The user will replace these with actual <Image> components
const reviewPlaceholders = ['#1c1917', '#292524', '#44403c', '#57534e', '#78716c']

export function ReviewsMarquee({ reviews = [] }: { reviews?: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseWidth, setBaseWidth] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)

  // Ensure we have enough items to cover the screen width (at least ~5 items)
  // so the scrolling wrap logic doesn't break on ultra-wide screens if only 1 review is uploaded.
  let expandedItems = reviews.length > 0 ? [...reviews] : [...reviewPlaceholders]
  while (expandedItems.length < 5) {
    expandedItems = [...expandedItems, ...(reviews.length > 0 ? reviews : reviewPlaceholders)]
  }

  const baseItemsCount = expandedItems.length
  // Render 4 copies so we have an off-screen buffer on both sides for dragging
  const items = [...expandedItems, ...expandedItems, ...expandedItems, ...expandedItems]

  // Calculate the width of one single sequence (baseWidth)
  useEffect(() => {
    const calculateWidth = () => {
      // The container holds child divs representing items.
      // We know there are 4 sets of the base items.
      if (containerRef.current) {
        setBaseWidth(containerRef.current.scrollWidth / 4)
        // Instantly snap to the middle section (-baseWidth) so we have space to drag left/right
        x.set(-(containerRef.current.scrollWidth / 4))
      }
    }

    // Slight timeout in case layout is still painting
    const timer = setTimeout(calculateWidth, 100)
    window.addEventListener('resize', calculateWidth)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', calculateWidth)
    }
  }, [x])

  // Automatic scrolling loop
  useAnimationFrame((t, delta) => {
    if (!baseWidth || isDragging) return

    // speed in px/ms
    const moveBy = 0.05 * delta
    const currentX = x.get() - moveBy

    // Wrap x between -baseWidth*2 and -baseWidth
    // For example, if width is 1000px, we wrap between -2000 and -1000.
    // That means we are always looking at the second copy (Set 1 or Set 2).
    const wrappedX = wrap(-baseWidth * 2, -baseWidth, currentX)
    x.set(wrappedX)
  })

  // Handle continuous wrapping even while dragging manually
  const handleDrag = () => {
    if (!baseWidth) return
    const currentX = x.get()
    const wrappedX = wrap(-baseWidth * 2, -baseWidth, currentX)
    x.set(wrappedX)
  }

  return (
    <section className="w-full overflow-hidden bg-[var(--stone-50)] pt-24 pb-0 relative flex flex-col">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-20 mb-12 sm:mb-16 text-left">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--muted)] mb-3">
            Японський ніж — це не просто річ, це мистецтво.
          </p>
          <h2 className="heading-display text-4xl md:text-4xl">
            Багато з вас вже користуються цими клинками і цінують їх.
          </h2>
        </AnimatedSection>
      </div>

      <div className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing">
        {/* We use a touch action to prevent vertical scroll from locking horizontal drag, but typically `pan-y` is better */}
        <motion.div
          ref={containerRef}
          className="flex w-max touch-pan-y"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -100000, right: 100000 }} // unbounded so we can drag infinitely
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={handleDrag}
        >
          {items.map((srcOrColor, i) => {
            const isImage = srcOrColor.startsWith('/') || srcOrColor.startsWith('http')
            return (
              <div
                key={i}
                // Removed gaps, borders, paddings. Touches edge-to-edge.
                className="w-[280px] h-[450px] sm:w-[350px] sm:h-[600px] shrink-0 relative"
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center text-white/50 text-sm font-medium select-none pointer-events-none overflow-hidden relative"
                  style={{ backgroundColor: isImage ? undefined : srcOrColor }}
                >
                  {isImage ? (
                    <Image
                      src={srcOrColor}
                      alt={`Review ${i}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 280px, 350px"
                    />
                  ) : (
                    <>
                      Скріншот {(i % baseItemsCount) + 1}
                      <p className="mt-2 text-[10px] uppercase tracking-widest text-center px-4 opacity-50">
                        {reviews.length > 0 ? 'Очікування фотографій...' : '(Drag to scroll)'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

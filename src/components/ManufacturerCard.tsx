'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import './ManufacturerCard.css'

interface ManufacturerCardProps {
  en: string
  jp: string
  delay?: number
}

export function ManufacturerCard({ en, jp, delay = 0 }: ManufacturerCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <AnimatedSection delay={delay}>
      <div 
        className="group relative h-full w-full cursor-pointer perspective-1000"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <motion.div
          className="relative h-full w-full w-full preserve-3d"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            duration: 0.7,
            ease: "easeInOut"
          }}
          style={{ minHeight: '60px' }}
        >
          {/* Front Side */}
          <div className="absolute inset-0 backface-hidden border border-black/6 bg-[#FAFAF9] px-4 py-4 flex items-center gap-3 hover:border-black/15 transition-colors duration-300">
            <span className="mt-[2px] w-1.5 h-1.5 bg-black/10 group-hover:bg-[var(--gold)] transition-colors duration-300 shrink-0"></span>
            <div className="font-sans text-[12px] tracking-[0.12em] uppercase text-black/70 group-hover:text-black transition-colors duration-300 leading-tight">
              {en}
            </div>
          </div>

          {/* Back Side */}
          <div 
            className="absolute inset-0 backface-hidden border border-black/12 px-4 py-4 flex items-center justify-center rotate-y-180"
            style={{ backgroundColor: '#BC002D' }}
          >
            <div className="font-serif text-[14px] tracking-widest text-white/90 leading-tight text-center">
              {jp}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  )
}

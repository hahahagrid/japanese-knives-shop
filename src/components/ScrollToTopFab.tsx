'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp } from 'lucide-react'

export function ScrollToTopFab() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[100] flex flex-col items-center group pointer-events-auto"
          aria-label="Вгору"
        >
          {/* Vertical Knife Handle/Blade Visual */}
          <div className="relative flex flex-col items-center">
            {/* The "Blade" Tip (Icon) */}
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#0A0A09] border border-white/10 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:border-[var(--gold)] transition-colors duration-500 backdrop-blur-md">
              <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-[var(--gold)] transition-all duration-500" />
              
              {/* Shine streak animation on hover */}
              <div className="absolute inset-x-0 h-full w-2 bg-white/10 -skew-x-[25deg] -translate-x-12 group-hover:translate-x-24 transition-transform duration-1000 ease-in-out"></div>
            </div>

            {/* The "Blade" vertical line extension */}
            <div className="w-[1px] h-0 group-hover:h-8 bg-gradient-to-b from-[var(--gold)] to-transparent transition-all duration-500 mt-2"></div>
            
            {/* The Kanji for "Up" (上) or "Blade" (刃) */}
            <span className="text-[10px] tracking-[0.5em] uppercase text-black/40 font-serif opacity-0 group-hover:opacity-100 transition-opacity duration-700 mt-1 origin-top scale-75">
              上
            </span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

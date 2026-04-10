'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function LoadingScreen() {
  const pathname = usePathname()
  const [show, setShow] = useState(true)

  // DISABLED GLOBALLY: returning null to skip all JS and rendering
  // The polished animation code is preserved below.
  return null;

  useEffect(() => {
    // If we're on a page that should skip intro, hide immediately
    if (typeof window !== 'undefined' && document.documentElement.classList.contains('skip-intro')) {
      setShow(false)
      return
    }

    // Increased timeout to allow full animation sequence to finish (Knife + Doors)
    const timer = setTimeout(() => {
      setShow(false)
    }, 1600) // Sequence: Knife (0.6s) -> Doors start (0.4s) -> Doors finish (1.4s) -> Fade out
    return () => clearTimeout(timer)
  }, [pathname])

  if (typeof window !== 'undefined' && document.documentElement.classList.contains('skip-intro')) {
    return null
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="loading-screen"
          className="fixed inset-0 z-[9999] flex bg-transparent"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
        >
          {/* Left Paper Half */}
          <motion.div
            className="h-full w-1/2 bg-[#fbfbfd] border-r border-black/5 relative overflow-hidden"
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Subtle paper texture overlay could be added here */}
          </motion.div>

          {/* Right Paper Half */}
          <motion.div
            className="h-full w-1/2 bg-[#fbfbfd] border-l border-black/5 relative overflow-hidden"
            initial={{ x: 0 }}
            animate={{ x: '100%' }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Central Knife Container */}
          <div className="absolute inset-0 pointer-events-none">
            {/* The Knife - Smaller, faster and high-contrast */}
            <motion.div
              className="absolute left-1/2 top-0 z-10"
              style={{ x: '-50%' }}
              initial={{ y: -220, opacity: 1 }}
              animate={{ y: '110vh' }}
              transition={{ duration: 0.7, ease: 'linear' }}
            >
              <svg 
                width="32" 
                height="200" 
                viewBox="0 0 32 200" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
              >
                {/* Octagonal Handle - Pure Black */}
                <path d="M12 0H20L22 45V70H10V45L12 0Z" fill="#000000" />
                
                {/* Bolster - High-contrast Steel */}
                <rect x="9" y="70" width="14" height="8" fill="#222222" />
                
                {/* Premium Blade - Polished Steel */}
                <path 
                  d="M10 78 H22 V180 C22 190 16 200 16 200 C16 200 10 190 10 180 V78Z" 
                  fill="#D4D4D4" 
                />
                
                {/* Blade Highlight - For that sharp look */}
                <path 
                  d="M16 78 H22 V180 C22 190 16 200 16 200 Z" 
                  fill="white" 
                  fillOpacity="0.4" 
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

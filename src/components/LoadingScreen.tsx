'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function LoadingScreen() {
  const pathname = usePathname()
  const [show, setShow] = useState(true)

  // Re-enabled for performance testing

  useEffect(() => {
    // If we're on a page that should skip intro, hide immediately
    if (document.documentElement.classList.contains('skip-intro')) {
      setShow(false)
      return
    }

    // Drastically reduced timeout for better UX and performance scores
    const timer = setTimeout(() => {
      setShow(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [pathname])

  // Critical: do not even render the initial frame if we already know we should skip
  if (typeof window !== 'undefined' && document.documentElement.classList.contains('skip-intro')) {
    return null
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="loading-screen"
          className="fixed inset-0 z-[9999] flex pointer-events-none"
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {/* Left Paper Half */}
          <motion.div
            className="h-full w-1/2 bg-[#fbfbfd] border-r border-black/5 relative overflow-hidden"
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Right Paper Half */}
          <motion.div
            className="h-full w-1/2 bg-[#fbfbfd] border-l border-black/5 relative overflow-hidden"
            initial={{ x: 0 }}
            animate={{ x: '100%' }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Central Cut Line & Knife Container */}
          <motion.div
            className="absolute inset-0 flex justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {/* The Cut Line - grows down with the knife */}
            <motion.div
              className="w-[1px] bg-[var(--gold)] opacity-30"
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              transition={{ duration: 0.5, ease: 'linear' }}
            />

            {/* The Knife SVG - moves down along the cut line */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 text-[var(--gold)]"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: '100vh', opacity: 1 }}
              transition={{ duration: 0.5, ease: 'linear' }}
            >
              <svg 
                width="24" 
                height="120" 
                viewBox="0 0 24 120" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="translate-y-[-100%]"
              >
                <path d="M12 4L14 12L14 100C14 105 12 110 12 110C12 110 10 105 10 100L10 12L12 4Z" fill="currentColor" />
                <rect x="11.5" y="0" width="1" height="120" fill="currentColor" opacity="0.2" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

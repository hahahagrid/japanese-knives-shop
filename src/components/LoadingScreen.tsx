'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function LoadingScreen() {
  const [show, setShow] = useState(() => {
    // Synchronous initial state check to prevent flicker
    if (typeof document !== 'undefined' && document.documentElement.classList.contains('skip-intro')) {
      return false
    }
    return true
  })
  const pathname = usePathname()

  useEffect(() => {
    // If we're on a page that should skip intro, hide immediately
    if (document.documentElement.classList.contains('skip-intro')) {
      setShow(false)
      return
    }

    const timer = setTimeout(() => {
      setShow(false)
    }, 2800)
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
          key="loading-screen"
          className="fixed inset-0 z-[99999] flex pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {/* Left Paper Half */}
          <motion.div
            className="h-full w-1/2 bg-[#fbfbfd] border-r border-black/5 relative overflow-hidden"
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            transition={{ delay: 1.0, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Right Paper Half */}
          <motion.div
            className="h-full w-1/2 bg-[#fbfbfd] border-l border-black/5 relative overflow-hidden"
            initial={{ x: 0 }}
            animate={{ x: '100%' }}
            transition={{ delay: 1.0, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Central Cut Line & Knife Container */}
          <motion.div
            className="absolute inset-0 flex justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            {/* The Cut Line - grows down with the knife */}
            <motion.div
              className="absolute top-0 w-[1px] bg-black/15 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
              initial={{ height: 0 }}
              animate={{ height: 'calc(var(--vh, 1vh) * 100)' }}
              transition={{ duration: 0.9, ease: 'linear' }}
            />

            {/* The Knife SVG */}
            <motion.div
              className="absolute top-0 flex justify-center w-12"
              initial={{ y: '-100%' }} 
              animate={{ y: 'calc(var(--vh, 1vh) * 100)' }}
              transition={{ duration: 0.9, ease: 'linear' }}
            >
              <div className="relative -top-40 flex flex-col items-center drop-shadow-2xl">
                {/* Knife Handle */}
                <div className="w-3.5 h-16 bg-[#1f1610] rounded-t-sm shadow-inner" />
                {/* Knife Bolster */}
                <div className="w-5 h-2.5 bg-[#4b5563]" />
                {/* Knife Blade (Silhouette top-down minimalist) */}
                <svg width="24" height="140" viewBox="0 0 24 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M4 0 L20 0 L20 100 C20 120 12 140 12 140 C12 140 4 120 4 100 L4 0 Z" fill="#9ca3af" />
                   <path d="M4 0 L12 0 L12 140 C12 140 4 120 4 100 L4 0 Z" fill="#d1d5db" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

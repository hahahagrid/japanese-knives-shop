'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import React from 'react'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  /** Use 'fade-up' (default) or 'fade-in' for a flat fade */
  variant?: 'fade-up' | 'fade-in'
}

const variants = {
  'fade-up': {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  variant = 'fade-up',
}: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[variant]}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1], // Smoother deceleration
      }}
      style={{
        transform: 'translateZ(0)',
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

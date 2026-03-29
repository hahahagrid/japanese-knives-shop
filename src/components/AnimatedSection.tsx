'use client'

import { motion } from 'framer-motion'
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
    hidden: { opacity: 0, y: 24 },
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
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={variants[variant]}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1], // Precise editorial ease
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

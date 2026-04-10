'use client'

import React from 'react'
import { m, Variants } from 'framer-motion'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
  variant?: 'fade-up' | 'fade-in' | 'slide-in'
}

const variants: Record<string, Variants> = {
  'fade-up': {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  'slide-in': {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }
}

export const AnimatedSection = ({ children, delay = 0, className = '', variant = 'fade-up' }: Props) => {
  const currentVariant = variants[variant as string] || variants['fade-up']

  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={currentVariant}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </m.div>
  )
}

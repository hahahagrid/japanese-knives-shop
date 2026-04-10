'use client'

import React from 'react'
import { m } from 'framer-motion'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
}

export const AnimatedSection = ({ children, delay = 0, className = '' }: Props) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </m.div>
  )
}

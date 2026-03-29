'use client'

import React from 'react'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  variant?: 'fade-up' | 'fade-in'
}

/**
 * AnimatedSection: Simplified to a static wrapper to eliminate mobile jitter.
 * We are removing all Framer Motion logic as per user request for absolute stability.
 */
export function AnimatedSection({
  children,
  className,
}: AnimatedSectionProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

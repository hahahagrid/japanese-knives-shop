'use client'

import React, { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
  variant?: 'fade-up' | 'fade-in' | 'slide-in'
}

export const AnimatedSection = ({ children, delay = 0, className = '', variant = 'fade-up' }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Apply delay via CSS custom property
    if (delay > 0) {
      el.style.transitionDelay = `${delay}s`
    }

    // Use IntersectionObserver to trigger animation when element enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            // Once animated, stop observing (once: true behavior)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '-50px' }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      data-variant={variant}
      className={`animated-section ${className}`}
    >
      {children}
    </div>
  )
}

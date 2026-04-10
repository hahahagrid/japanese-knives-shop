'use client'

import React from 'react'
import { LazyMotion } from 'framer-motion'

const loadFeatures = () => import('@/lib/framer-features').then((res) => res.default)

export function FramerMotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  )
}

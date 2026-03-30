'use client'

import { useEffect } from 'react'

export function ViewportHandler() {
  useEffect(() => {
    let lastWidth = window.innerWidth
    
    const setVh = () => {
      const currentWidth = window.innerWidth
      const currentHeight = window.innerHeight
      
      // Only update if the width changed significantly (orientation change)
      // or if it's the initial load. 
      // This prevents the "jumping" when the mobile address bar hides/shows.
      if (currentWidth !== lastWidth || !document.documentElement.style.getPropertyValue('--vh')) {
        const vh = currentHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
        lastWidth = currentWidth
      }
    }

    // ── Image & Content Protection ─────────────────
    const preventAction = (e: MouseEvent | DragEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || target.closest('picture')) {
        e.preventDefault()
      }
    }

    setVh()
    
    // Listen for resize but be smart about it
    window.addEventListener('resize', setVh)
    window.addEventListener('orientationchange', setVh)
    
    // Protection listeners
    document.addEventListener('contextmenu', preventAction)
    document.addEventListener('dragstart', preventAction)

    return () => {
      window.removeEventListener('resize', setVh)
      window.removeEventListener('orientationchange', setVh)
      document.removeEventListener('contextmenu', preventAction)
      document.removeEventListener('dragstart', preventAction)
    }
  }, [])

  return null
}

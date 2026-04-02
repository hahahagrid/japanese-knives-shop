'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

interface FreshnessHandlerProps {
  initialVersion: string
}

export function FreshnessHandler({ initialVersion }: FreshnessHandlerProps) {
  const pathname = usePathname()
  const router = useRouter()
  const currentVersion = useRef(initialVersion)
  const lastChecked = useRef(Date.now())

  useEffect(() => {
    // On navigation, check if we need to refresh
    const checkFreshness = async () => {
      const now = Date.now()
      // Don't check more than once every 5 seconds per navigation
      if (now - lastChecked.current < 5000) return

      try {
        const res = await fetch('/api/freshness', { cache: 'no-store' })
        const data = await res.json()

        if (data.version && data.version !== currentVersion.current) {
          console.log('[Freshness] Content version mismatch. Refreshing...', {
            client: currentVersion.current,
            server: data.version,
          })
          
          currentVersion.current = data.version
          lastChecked.current = Date.now()
          
          // router.refresh() will re-render server components and update the client-side cache
          router.refresh()
        }
      } catch (err) {
        // Silently fail, it's just a freshness check
      }
    }

    checkFreshness()
  }, [pathname, router])

  // Also check on visibility change (when tab becomes active)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now()
        // If it's been more than 30 seconds since last check, check again
        if (now - lastChecked.current > 30000) {
          const checkFreshness = async () => {
            try {
              const res = await fetch('/api/freshness', { cache: 'no-store' })
              const data = await res.json()
              if (data.version && data.version !== currentVersion.current) {
                currentVersion.current = data.version
                router.refresh()
              }
            } catch (err) {}
          }
          checkFreshness()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [router])

  return null
}

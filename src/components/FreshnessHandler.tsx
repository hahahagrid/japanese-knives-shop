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
  const lastChecked = useRef(0)

  useEffect(() => {
    // On navigation or mount, check if we need to refresh
    const checkFreshness = async () => {
      const now = Date.now()
      
      // If it's the very first mount (lastChecked is default), we check immediately
      // Subsequent checks (navigations) are throttled to 5s
      const isInitialMount = lastChecked.current === 0
      if (!isInitialMount && now - lastChecked.current < 5000) return

      try {
        const res = await fetch('/api/freshness', { cache: 'no-store' })
        const data = await res.json()

        if (data.version && data.version !== currentVersion.current) {
          console.log('[Freshness] Content version mismatch.', {
            client: currentVersion.current,
            server: data.version,
            mode: isInitialMount ? 'hard-reload' : 'soft-refresh'
          })
          
          const oldVersion = currentVersion.current
          currentVersion.current = data.version
          lastChecked.current = Date.now()
          
          if (isInitialMount) {
            // If the server GAVE us a stale HTML on mount, we need a hard refresh
            // to bypass the stale-while-revalidate data cache.
            // We wait a tiny bit to allow the server to finish its background revalidation if it was just triggered.
            setTimeout(() => {
              window.location.reload()
            }, 500)
          } else {
            // If we are just navigating between pages in an existing session
            router.refresh()
          }
        }
      } catch (err) {}
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

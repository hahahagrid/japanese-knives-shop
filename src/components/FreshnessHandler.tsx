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
    const isInitialMount = lastChecked.current === 0

    // On navigation or mount, check if we need to refresh
    const checkFreshness = async () => {
      const now = Date.now()
      
      // We check every navigation or on mount
      // Throttling to 2.5s for better responsiveness in TG
      if (!isInitialMount && now - lastChecked.current < 2500) return

      try {
        const res = await fetch('/api/freshness', { cache: 'no-store' })
        const data = await res.json()
        const serverVersion = data.version

        // 1. Get the version from the server-rendered page segment (PageVersion component)
        const pageMarker = document.getElementById('page-version-marker')
        const pageVersion = pageMarker?.getAttribute('data-version') || initialVersion

        // 2. Compare against what the API says is the latest
        if (serverVersion && serverVersion !== pageVersion) {
          console.log('[Freshness] STALE PAGE DETECTED.', {
            id: pathname,
            page: pageVersion, // this is the version found in the DOM
            latest: serverVersion, // this is the version on the server
            mode: isInitialMount ? 'hard-reload' : 'soft-refresh'
          })
          
          lastChecked.current = Date.now()
          
          if (isInitialMount) {
            // If the server GAVE us stale HTML on mount, we reload hard
            setTimeout(() => {
              window.location.reload()
            }, 600)
          } else {
            // If navigating between cached pages
            router.refresh()
          }
        } else {
          // All good, update our check time
          lastChecked.current = Date.now()
        }
      } catch (err) {}
    }

    // Small delay to ensure the page segment (children) is mounted and the marker is available
    const timeout = setTimeout(checkFreshness, isInitialMount ? 0 : 300)
    return () => clearTimeout(timeout)
  }, [pathname, router, initialVersion])

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

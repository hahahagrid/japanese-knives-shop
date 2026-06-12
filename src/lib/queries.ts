import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Per-render deduplicated site-settings lookup.
 * The root layout, PageVersion marker and blog footer all need this global —
 * React cache() collapses them into a single DB query per render.
 */
export const getSiteSettings = cache(async () => {
  const payload = await getPayload({ config })
  return payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    draft: false,
    overrideAccess: false,
  })
})

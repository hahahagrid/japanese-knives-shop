import { getPayload } from 'payload'
import config from '@payload-config'

// Marker for content freshness detection
export async function PageVersion() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    draft: false,
  })

  // This renders a hidden div that the FreshnessHandler in layout can read
  return (
    <div 
      id="page-version-marker" 
      data-version={settings.contentVersion || 'init'} 
      style={{ display: 'none' }}
      aria-hidden="true" 
    />
  )
}

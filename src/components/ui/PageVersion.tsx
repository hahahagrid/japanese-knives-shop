import { getSiteSettings } from '@/lib/queries'

// Marker for content freshness detection
export async function PageVersion() {
  const settings = await getSiteSettings()

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

/**
 * Centralised runtime configuration.
 *
 * NEXT_PUBLIC_* values are read at build time and inlined into client bundles.
 * Set them in Railway environment variables; the fallbacks below are kept so
 * the project still works locally without a .env override.
 */

const stripTrailingSlash = (s: string): string => s.replace(/\/+$/, '')

export const SITE_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL || 'https://japanese-kitchen-knives.com.ua',
)

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-5BK9W2PZ'

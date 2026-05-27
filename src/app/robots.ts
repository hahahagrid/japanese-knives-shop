import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/config'

/**
 * Dynamic robots.txt generation based on environment.
 * On PROD server (where BASIC_AUTH_PASS is missing and NODE_ENV is production), allow all.
 * On DEV/STAGING server, explicitly block all crawlers with 'Disallow: /'.
 */
export default function robots(): MetadataRoute.Robots {
  const isDev =
    process.env.BASIC_AUTH_PASS !== undefined ||
    process.env.NODE_ENV !== 'production' ||
    SITE_URL.includes('dev.')

  if (isDev) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

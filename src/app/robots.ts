import { MetadataRoute } from 'next'

/**
 * Dynamic robots.txt generation based on environment.
 * On PROD server (where BASIC_AUTH_PASS is missing and NODE_ENV is production), allow all.
 * On DEV/STAGING server, explicitly block all crawlers with 'Disallow: /'.
 */
export default function robots(): MetadataRoute.Robots {
  // Logic: Block indexing if we're not in PROD or if basic-auth is enabled
  const isDev = process.env.BASIC_AUTH_PASS !== undefined || process.env.NODE_ENV !== 'production'
  
  if (isDev) {
    // DEV MODE: Block indexing
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  // PRODUCTION MODE: Allow search engines to index
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
  }
}

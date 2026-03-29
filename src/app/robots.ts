import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // If basic auth is configured (Dev environment) or not PROD, block all indexing
  const isDev = process.env.BASIC_AUTH_PASS !== undefined || process.env.NODE_ENV !== 'production'
  
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
  }
}

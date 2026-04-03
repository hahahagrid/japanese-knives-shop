import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  
  // Try to determine base URL from env or fallback
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://japanese-kitchen-knives.com.ua'

  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/contacts',
    '/shipping',
    '/knives/in-stock',
    '/knives/custom-order',
    '/accessories',
    '/blog',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // 2. Fetch Products (Knives & Accessories)
  const products = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 0,
    overrideAccess: false,
  })

  const productRoutes: MetadataRoute.Sitemap = products.docs.map((product) => {
    let path = ''
    if (product.type === 'knife') {
      // Map 'custom_order' to 'custom-order' and 'in_stock' to 'in-stock' for URLs
      const statusSlug = product.status?.replace('_', '-') || 'in-stock'
      path = `/knives/${statusSlug}/${product.slug}`
    } else {
      path = `/accessories/${product.slug}`
    }
    
    return {
      url: `${siteUrl}${path}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  })

  // 3. Fetch Blog Posts
  const posts = await payload.find({
    collection: 'posts',
    limit: 1000,
    depth: 0,
    overrideAccess: false,
  })

  const postRoutes: MetadataRoute.Sitemap = posts.docs.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...productRoutes, ...postRoutes]
}

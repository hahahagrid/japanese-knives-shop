import { revalidatePath } from 'next/cache'

export const revalidateProduct: any = ({ doc, previousDoc }: any) => {
  // Revalidate the specific product page
  // If versioning is off, doc._status is undefined, so we assume it is published
  const isPublished = !doc._status || doc._status === 'published'
  const wasPublished = !previousDoc || !previousDoc._status || previousDoc._status === 'published'

  if (isPublished || wasPublished) {
    const statusSlug = doc.status?.replace('_', '-') || 'in-stock'
    const prefix = doc.type === 'accessory' ? '/accessories' : `/knives/${statusSlug}`
    
    // Clear specific page
    revalidatePath(`${prefix}/${doc.slug}`)
    
    // Clear listing pages with 'layout' type to be extremely aggressive
    // This ensures that the catalogue listing (which might be cached in layouts) is refreshed
    revalidatePath('/knives/in-stock', 'page')
    revalidatePath('/knives/custom-order', 'page')
    revalidatePath('/accessories', 'page')
    revalidatePath('/blog', 'page')
    
    // Nuclear option for maximum consistency: revalidate the shared layout
    // This tells Next.js to drop ALL client-side and server-side cached data for the frontend
    revalidatePath('/', 'layout')
  }
  return doc
}

export const revalidatePost: any = ({ doc, previousDoc }: any) => {
  const isPublished = !doc._status || doc._status === 'published'
  const wasPublished = !previousDoc || !previousDoc._status || previousDoc._status === 'published'

  if (isPublished || wasPublished) {
    revalidatePath(`/blog/${doc.slug}`)
    revalidatePath('/blog', 'page')
    revalidatePath('/', 'layout')
  }
  return doc
}

export const revalidateGlobal: any = (slug: string) => {
  const hook: any = ({ doc }: any) => {
    revalidatePath('/', 'layout')
    return doc
  }
  return hook
}

export const revalidateDelete: any = ({ doc }: any) => {
  // When deleting, we want to clear everything to avoid ghost products in listings
  revalidatePath('/', 'layout')
  return doc
}

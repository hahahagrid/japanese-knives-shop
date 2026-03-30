import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateProduct: any = ({ doc, previousDoc }: any) => {
  // Revalidate the specific product page
  // If versioning is off, doc._status is undefined, so we assume it is published
  const isPublished = !doc._status || doc._status === 'published'
  const wasPublished = !previousDoc || !previousDoc._status || previousDoc._status === 'published'

  if (isPublished || wasPublished) {
    const statusSlug = doc.status?.replace('_', '-') || 'in-stock'
    const prefix = doc.type === 'accessory' ? '/accessories' : `/knives/${statusSlug}`
    
    revalidatePath(`${prefix}/${doc.slug}`)
    
    // Also revalidate the listing pages
    revalidatePath(doc.type === 'accessory' ? '/accessories' : '/knives/in-stock')
    revalidatePath('/knives/custom-order')
    
    // And the homepage since it shows featured products
    revalidatePath('/')
  }
  return doc
}

export const revalidatePost: any = ({ doc, previousDoc }: any) => {
  const isPublished = !doc._status || doc._status === 'published'
  const wasPublished = !previousDoc || !previousDoc._status || previousDoc._status === 'published'

  if (isPublished || wasPublished) {
    revalidatePath(`/blog/${doc.slug}`)
    revalidatePath('/blog')
  }
  return doc
}

export const revalidateGlobal: any = (slug: string) => {
  const hook: any = ({ doc }: any) => {
    revalidatePath('/', 'layout') // Revalidate everything if globals change
    return doc
  }
  return hook
}

export const revalidateDelete: any = ({ doc }: any) => {
  const statusSlug = doc.status?.replace('_', '-') || 'in-stock'
  const prefix = doc.type === 'accessory' ? '/accessories' : `/knives/${statusSlug}`
  revalidatePath(`${prefix}/${doc.slug}`)
  revalidatePath('/') // Just in case
  return doc
}

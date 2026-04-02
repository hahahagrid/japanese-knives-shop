import { revalidatePath } from 'next/cache'

const updateContentVersion = async (req: any) => {
  // Prevent infinite loops if we're already updating the version
  if (req?.payload && !req.context?.skipVersionUpdate) {
    try {
      await req.payload.updateGlobal({
        slug: 'site-settings',
        data: {
          contentVersion: new Date().toISOString(),
        },
        req,
        context: { skipVersionUpdate: true }, // Set flag to prevent loop
      })
    } catch (err) {
      console.error('Error updating contentVersion:', err)
    }
  }
}

export const revalidateProduct: any = async ({ doc, previousDoc, req }: any) => {
  await updateContentVersion(req)

  const isPublished = !doc._status || doc._status === 'published'
  const wasPublished = !previousDoc || !previousDoc._status || previousDoc._status === 'published'

  if (isPublished || wasPublished) {
    const statusSlug = doc.status?.replace('_', '-') || 'in-stock'
    const prefix = doc.type === 'accessory' ? '/accessories' : `/knives/${statusSlug}`
    
    revalidatePath(`${prefix}/${doc.slug}`)
    revalidatePath('/knives/in-stock', 'page')
    revalidatePath('/knives/custom-order', 'page')
    revalidatePath('/accessories', 'page')
    revalidatePath('/blog', 'page')
    revalidatePath('/', 'layout')
  }
  return doc
}

export const revalidatePost: any = async ({ doc, previousDoc, req }: any) => {
  await updateContentVersion(req)

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
  const hook: any = async ({ doc, req, context }: any) => {
    // Don't update version if it was the version update itself
    if (context?.skipVersionUpdate) return doc

    // Update version for other globals (e.g. Navigation, Reviews)
    if (slug !== 'site-settings') {
      await updateContentVersion(req)
    }
    
    revalidatePath('/', 'layout')
    return doc
  }
  return hook
}

export const revalidateDelete: any = async ({ doc, req }: any) => {
  await updateContentVersion(req)
  revalidatePath('/', 'layout')
  return doc
}

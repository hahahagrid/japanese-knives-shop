import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

const updateContentVersion = async (req: PayloadRequest): Promise<void> => {
  // Prevent infinite loops if we're already updating the version
  if (req?.payload && !req.context?.skipVersionUpdate) {
    try {
      await req.payload.updateGlobal({
        slug: 'site-settings',
        data: {
          contentVersion: new Date().toISOString(),
        },
        req,
        context: { skipVersionUpdate: true },
      })
    } catch (err) {
      console.error('Error updating contentVersion:', err)
    }
  }
}

type RevalidatableDoc = {
  slug?: string | null
  status?: string | null
  type?: string | null
  _status?: 'draft' | 'published' | null
}

const isPublished = (doc: RevalidatableDoc | undefined | null): boolean =>
  !doc?._status || doc._status === 'published'

export const revalidateProduct: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  await updateContentVersion(req)

  const product = doc as RevalidatableDoc
  const previous = previousDoc as RevalidatableDoc | undefined

  if (isPublished(product) || isPublished(previous)) {
    const statusSlug = product.status?.replace('_', '-') || 'in-stock'
    const prefix = product.type === 'accessory' ? '/accessories' : `/knives/${statusSlug}`

    if (product.slug) revalidatePath(`${prefix}/${product.slug}`)
    revalidatePath('/knives/in-stock', 'page')
    revalidatePath('/knives/custom-order', 'page')
    revalidatePath('/accessories', 'page')
    revalidatePath('/blog', 'page')
    revalidatePath('/', 'layout')
  }
  return doc
}

export const revalidatePost: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  await updateContentVersion(req)

  const post = doc as RevalidatableDoc
  const previous = previousDoc as RevalidatableDoc | undefined

  if (isPublished(post) || isPublished(previous)) {
    if (post.slug) revalidatePath(`/blog/${post.slug}`)
    revalidatePath('/blog', 'page')
    revalidatePath('/', 'layout')
  }
  return doc
}

export const revalidateGlobal = (slug: string): GlobalAfterChangeHook => {
  const hook: GlobalAfterChangeHook = async ({ doc, req, context }) => {
    if (context?.skipVersionUpdate) return doc

    if (slug !== 'site-settings') {
      await updateContentVersion(req)
    }

    revalidatePath('/', 'layout')
    return doc
  }
  return hook
}

export const revalidateDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await updateContentVersion(req)
  revalidatePath('/', 'layout')
  return doc
}

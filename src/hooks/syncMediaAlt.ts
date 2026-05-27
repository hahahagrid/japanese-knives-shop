import type { CollectionAfterChangeHook } from 'payload'

type ImageRef = string | number | { id: string | number }

type LexicalUploadNode = {
  type: string
  relationTo?: string
  value?: ImageRef
  children?: LexicalUploadNode[]
  root?: { children?: LexicalUploadNode[] }
}

const extractId = (ref: ImageRef | undefined | null): string | number | null => {
  if (ref == null) return null
  if (typeof ref === 'object') return ref.id ?? null
  return ref
}

/**
 * Хук для автоматичної синхронізації ALT-текстів зображень з назвою товару.
 * Спрацьовує після створення або оновлення товару.
 */
export const syncMediaAlt: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (!doc.title) return doc

  const { payload } = req
  const altText: string = doc.title
  const imageIds = new Set<string | number>()

  if (Array.isArray(doc.images)) {
    for (const image of doc.images as ImageRef[]) {
      const id = extractId(image)
      if (id != null) imageIds.add(id)
    }
  }

  if (doc.description) {
    const traverse = (node: LexicalUploadNode | undefined | null) => {
      if (!node) return
      if (node.type === 'upload' && node.relationTo === 'media') {
        const id = extractId(node.value)
        if (id != null) imageIds.add(id)
      }
      node.children?.forEach(traverse)
      node.root?.children?.forEach(traverse)
    }
    traverse(doc.description as LexicalUploadNode)
  }

  for (const id of imageIds) {
    try {
      await payload.update({
        collection: 'media',
        id,
        data: { alt: altText },
        req,
      })
    } catch (error) {
      payload.logger.error({ error }, `[SyncMediaAlt] Помилка оновлення медіа ${id}`)
    }
  }

  return doc
}

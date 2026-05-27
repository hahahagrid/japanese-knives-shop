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
 * Хук для автоматичної синхронізації ALT-текстів зображень із заголовком статті.
 * Оновлює як обкладинку (coverImage), так і всі зображення, додані в текст статті (richText).
 */
export const syncPostMediaAlt: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (!doc.title) return doc

  const { payload } = req
  const altText: string = doc.title
  const imageIds = new Set<string | number>()

  const coverId = extractId(doc.coverImage as ImageRef | undefined)
  if (coverId != null) imageIds.add(coverId)

  if (doc.content) {
    const traverse = (node: LexicalUploadNode | undefined | null) => {
      if (!node) return
      if (node.type === 'upload' && node.relationTo === 'media') {
        const id = extractId(node.value)
        if (id != null) imageIds.add(id)
      }
      node.children?.forEach(traverse)
      node.root?.children?.forEach(traverse)
    }
    traverse(doc.content as LexicalUploadNode)
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
      payload.logger.error(
        { error },
        `[SyncPostMediaAlt] Помилка оновлення медіа ${id} для статті ${doc.id}`,
      )
    }
  }

  return doc
}

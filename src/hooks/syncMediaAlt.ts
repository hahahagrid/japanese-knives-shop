import type { CollectionAfterChangeHook } from 'payload'

/**
 * Хук для автоматичної синхронізації ALT-текстів зображень з назвою товару.
 * Спрацьовує після створення або оновлення товару.
 */
export const syncMediaAlt: CollectionAfterChangeHook = async ({
  doc, // Новий документ товару
  req, // Об'єкт запиту
}) => {
  // Якщо немає назви - нічого не робимо
  if (!doc.title) {
    return doc
  }

  const { payload } = req
  const altText = doc.title
  const imageIds = new Set<string>()

  // 1. Прямий масив зображень (Gallery)
  if (doc.images && Array.isArray(doc.images)) {
    doc.images.forEach((image: any) => {
      const id = typeof image === 'object' && image !== null ? image.id : image
      if (id) imageIds.add(id)
    })
  }

  // 2. Зображення з Опису (Rich Text / Lexical)
  if (doc.description) {
    const traverse = (node: any) => {
      if (!node) return
      if (node.type === 'upload' && node.relationTo === 'media' && node.value) {
        const id = typeof node.value === 'object' && node.value !== null ? node.value.id : node.value
        if (id) imageIds.add(id)
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(traverse)
      }
      if (node.root && node.root.children && Array.isArray(node.root.children)) {
        node.root.children.forEach(traverse)
      }
    }
    traverse(doc.description)
  }

  // Оновлюємо всі знайдені зображення
  for (const id of imageIds) {
    try {
      await payload.update({
        collection: 'media',
        id,
        data: {
          alt: altText,
        },
        req,
      })
    } catch (error) {
      payload.logger.error({ error }, `[SyncMediaAlt] Помилка оновлення медіа ${id}`)
    }
  }

  return doc
}

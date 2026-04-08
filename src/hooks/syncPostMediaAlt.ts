import type { CollectionAfterChangeHook } from 'payload'

/**
 * Хук для автоматичної синхронізації ALT-текстів зображень із заголовком статті.
 * Оновлює як обкладинку (coverImage), так і всі зображення, додані в текст статті (richText).
 */
export const syncPostMediaAlt: CollectionAfterChangeHook = async ({
  doc, // Новий документ статті
  req, // Об'єкт запиту
}) => {
  // Якщо немає заголовка - нічого не робимо
  if (!doc.title) {
    return doc
  }

  const { payload } = req
  const altText = doc.title
  const imageIds = new Set<string>()

  // 1. Збираємо ID обкладинки
  if (doc.coverImage) {
    const coverId = typeof doc.coverImage === 'object' && doc.coverImage !== null ? doc.coverImage.id : doc.coverImage
    if (coverId) imageIds.add(coverId)
  }

  // 2. Збираємо ID всіх зображень з Rich Text (Lexical)
  if (doc.content) {
    const traverse = (node: any) => {
      if (!node) return

      // Шукаємо вузли типу 'upload', які посилаються на 'media'
      if (node.type === 'upload' && node.relationTo === 'media' && node.value) {
        const id = typeof node.value === 'object' && node.value !== null ? node.value.id : node.value
        if (id) imageIds.add(id)
      }

      // Рекурсивно проходимо по дітях вузла
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(traverse)
      }

      // Окремо перевіряємо корінь Lexical, якщо він є
      if (node.root && node.root.children && Array.isArray(node.root.children)) {
        node.root.children.forEach(traverse)
      }
    }

    traverse(doc.content)
  }

  // 3. Оновлюємо всі знайдені зображення в колекції Media
  for (const id of imageIds) {
    try {
      await payload.update({
        collection: 'media',
        id,
        data: {
          alt: altText,
        },
        req, // Передаємо req для збереження контексту транзакції
      })
    } catch (error) {
      payload.logger.error({ error }, `[SyncPostMediaAlt] Помилка оновлення медіа ${id} для статті ${doc.id}`)
    }
  }

  return doc
}

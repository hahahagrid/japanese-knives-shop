import type { CollectionAfterChangeHook } from 'payload'

/**
 * Хук для автоматичної синхронізації ALT-текстів зображень з назвою товару.
 * Спрацьовує після створення або оновлення товару.
 */
export const syncMediaAlt: CollectionAfterChangeHook = async ({
  doc, // Новий документ товару
  req, // Об'єкт запиту (для доступу до Payload API)
  operation, // 'create' або 'update'
}) => {
  // Якщо немає картинок або назви - нічого не робимо
  if (!doc.images || doc.images.length === 0 || !doc.title) {
    return doc
  }

  const altText = doc.title
  const { payload } = req

  // Проходимо по масиву зображень
  for (const image of doc.images) {
    // В Payload зображення може бути як ID (string/number), так і об'єктом
    const imageId = typeof image === 'object' && image !== null ? image.id : image

    if (imageId) {
      try {
        await payload.update({
          collection: 'media',
          id: imageId,
          data: {
            alt: altText,
          },
          req, // Обов'язково передаємо req для збереження транзакції
        })
      } catch (error) {
        payload.logger.error(`[SyncMediaAlt] Помилка оновлення медіа ${imageId}:`, error)
      }
    }
  }

  return doc
}

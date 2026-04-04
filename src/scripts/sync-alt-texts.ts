import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function syncAltTexts() {
  console.log('Починаємо підключення до Payload CMS...')
  
  // Ініціалізація Payload API (Local API)
  const payload = await getPayload({ config: configPromise })

  console.log('Отримуємо список усіх товарів (ножі та аксесуари)...')
  
  // Достаємо всі продукти з бази
  const { docs: products } = await payload.find({
    collection: 'products',
    depth: 1, // Щоб мати id зображень у масиві images
    limit: 1000,
    pagination: false,
  })

  console.log(`Знайдено ${products.length} товарів. Запускаємо перевірку картинок...`)

  let updatedImagesCount = 0;
  let skippedImagesCount = 0;
  let failedImagesCount = 0;

  for (const product of products) {
    if (!product.images || product.images.length === 0) continue;
    
    // Беремо назву продукту (яку ми хочемо записати в ALT)
    const altText = product.title;

    for (let i = 0; i < product.images.length; i++) {
        const image = product.images[i]
        
        // Витягуємо ID зображення (залежно від того, як Payload повертає depth)
        const imageId = typeof image === 'object' && image !== null ? image.id : image
        
        if (imageId) {
            try {
                await payload.update({
                    collection: 'media',
                    id: String(imageId),
                    data: {
                        alt: altText
                    }
                })
                
                updatedImagesCount++
                console.log(`- Оновлено картинку (${imageId}) для "${altText}"`)
                
            } catch(e) {
                console.error(`Помилка оновлення картинки ${imageId} (Товар: ${altText}):\n`, e)
                failedImagesCount++
            }
        } else {
            skippedImagesCount++
        }
    }
  }

  console.log('----------------------------')
  console.log('Звіт про роботу скрипта:')
  console.log(`Успішно оновлено: ${updatedImagesCount} картинок`)
  console.log(`Пропущено пошкоджених лінків: ${skippedImagesCount}`)
  console.log(`Помилок: ${failedImagesCount}`)
  console.log('----------------------------')
  
  process.exit(0)
}

// Запуск
syncAltTexts().catch(err => {
    console.error('Критична помилка виконання:', err)
    process.exit(1)
})

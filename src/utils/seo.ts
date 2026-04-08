/**
 * Утиліти для генерації SEO-описів товарів та аксесуарів.
 * Використовуються як у мета-тегах, так і в JSON-LD Schema.
 */

/**
 * Витягує чистий текст із структури Lexical (Payload 3.0)
 */
export const getLexicalPlainText = (desc: any): string | null => {
  if (!desc || !desc.root || !desc.root.children) return null
  try {
    const text = desc.root.children
      .map((node: any) => node.children?.map((c: any) => c.text ?? '').join('') ?? '')
      .join(' ')
      .trim()
    
    return text.length > 10 ? text : null
  } catch (e) {
    return null
  }
}

/**
 * Генерує фінальний опис для товару/аксесуара
 */
export const generateProductDescription = (
  product: { title: string; price?: number | null; description?: any; type?: string },
  fallbackType: 'knife' | 'accessory' = 'knife'
): string => {
  const customDescription = getLexicalPlainText(product.description)
  
  if (customDescription) {
    // Якщо є кастомний текст, обрізаємо до ліміту SEO
    return customDescription.length > 160 
      ? `${customDescription.substring(0, 157)}...` 
      : customDescription
  }

  const priceText = product.price ? `Ціна: ${product.price.toLocaleString('uk-UA')} грн.` : ''

  if (fallbackType === 'knife' || product.type === 'knife') {
    return `Автентичний японський ніж ручної роботи ${product.title}. Преміальна сталь, бездоганна гострота та традиційне кування. ${priceText}`
  }

  // Fallback для аксесуарів
  const lowerTitle = product.title.toLowerCase()
  let prefix = 'Аксесуар'
  if (lowerTitle.includes('камінь') || lowerTitle.includes('whetstone')) prefix = 'Японський водний камінь'
  if (lowerTitle.includes('дошка')) prefix = 'Обробна дошка'
  if (lowerTitle.includes('підставка') || lowerTitle.includes('магніт')) prefix = 'Тримач для ножів'

  return `${prefix} ${product.title} преміальної якості для професійного догляду за вашими ножами. ${priceText}`
}

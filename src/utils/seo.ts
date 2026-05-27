/**
 * Утиліти для генерації SEO-описів товарів та аксесуарів.
 * Використовуються як у мета-тегах, так і в JSON-LD Schema.
 */

type LexicalTextNode = { text?: string }
type LexicalParagraph = { children?: LexicalTextNode[] }
type LexicalRoot = { root?: { children?: LexicalParagraph[] } }

/**
 * Витягує чистий текст із структури Lexical (Payload 3.0)
 */
export const getLexicalPlainText = (desc: unknown): string | null => {
  const value = desc as LexicalRoot | null | undefined
  if (!value?.root?.children) return null
  try {
    const text = value.root.children
      .map((node) => node.children?.map((c) => c.text ?? '').join('') ?? '')
      .join(' ')
      .trim()

    return text.length > 10 ? text : null
  } catch {
    return null
  }
}

type ProductDescriptionInput = {
  title: string
  price?: number | null
  description?: unknown
  type?: string | null
}

/**
 * Генерує фінальний опис для товару/аксесуара
 */
export const generateProductDescription = (
  product: ProductDescriptionInput,
  fallbackType: 'knife' | 'accessory' = 'knife',
): string => {
  const customDescription = getLexicalPlainText(product.description)

  if (customDescription) {
    return customDescription.length > 160
      ? `${customDescription.substring(0, 157)}...`
      : customDescription
  }

  const priceText = product.price ? `Ціна: ${product.price.toLocaleString('uk-UA')} грн.` : ''

  if (fallbackType === 'knife' || product.type === 'knife') {
    return `Автентичний японський ніж ручної роботи ${product.title}. Преміальна сталь, бездоганна гострота та традиційне кування. ${priceText}`
  }

  const lowerTitle = product.title.toLowerCase()
  let prefix = 'Аксесуар'
  if (lowerTitle.includes('камінь') || lowerTitle.includes('whetstone'))
    prefix = 'Японський водний камінь'
  if (lowerTitle.includes('дошка')) prefix = 'Обробна дошка'
  if (lowerTitle.includes('підставка') || lowerTitle.includes('магніт'))
    prefix = 'Тримач для ножів'

  return `${prefix} ${product.title} преміальної якості для професійного догляду за вашими ножами. ${priceText}`
}

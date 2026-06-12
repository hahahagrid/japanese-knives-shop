import { describe, it, expect } from 'vitest'
import { getLexicalPlainText, generateProductDescription } from '@/utils/seo'

const lexical = (...paragraphs: string[]) => ({
  root: {
    children: paragraphs.map((text) => ({ children: [{ text }] })),
  },
})

describe('getLexicalPlainText', () => {
  it('joins paragraph text from a Lexical document', () => {
    expect(getLexicalPlainText(lexical('Перший абзац', 'другий абзац'))).toBe(
      'Перший абзац другий абзац',
    )
  })

  it('returns null for text of 10 characters or fewer', () => {
    expect(getLexicalPlainText(lexical('коротко'))).toBeNull()
  })

  it('returns null for empty or malformed input', () => {
    expect(getLexicalPlainText(null)).toBeNull()
    expect(getLexicalPlainText({})).toBeNull()
    expect(getLexicalPlainText({ root: {} })).toBeNull()
  })
})

describe('generateProductDescription', () => {
  it('uses the custom description when present', () => {
    const product = {
      title: 'Gyuto 210mm',
      description: lexical('Унікальний ніж із блакитної сталі Aogami Super.'),
    }
    expect(generateProductDescription(product, 'knife')).toBe(
      'Унікальний ніж із блакитної сталі Aogami Super.',
    )
  })

  it('truncates long custom descriptions to 160 characters with an ellipsis', () => {
    const product = { title: 'Gyuto', description: lexical('x'.repeat(300)) }
    const result = generateProductDescription(product, 'knife')
    expect(result).toHaveLength(160)
    expect(result.endsWith('...')).toBe(true)
  })

  it('falls back to the knife template with title and price', () => {
    const result = generateProductDescription({ title: 'Santoku 170mm', price: 12500 }, 'knife')
    expect(result).toContain('Santoku 170mm')
    expect(result).toContain('Ціна:')
    expect(result).toContain('грн')
  })

  it('omits the price sentence when price is missing', () => {
    const result = generateProductDescription({ title: 'Santoku 170mm' }, 'knife')
    expect(result).not.toContain('Ціна:')
  })

  it('picks an accessory prefix from the title', () => {
    const result = generateProductDescription(
      { title: 'Точильний камінь 1000', type: 'accessory' },
      'accessory',
    )
    expect(result.startsWith('Японський водний камінь')).toBe(true)
  })
})

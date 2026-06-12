import { describe, it, expect } from 'vitest'
import { slugify } from '@/utils/slug'

describe('slugify', () => {
  it('lowercases and replaces spaces with dashes', () => {
    expect(slugify('Gyuto 210mm VG10')).toBe('gyuto-210mm-vg10')
  })

  it('collapses repeated whitespace, underscores and dashes', () => {
    expect(slugify('a  b_c--d')).toBe('a-b-c-d')
  })

  it('strips special characters', () => {
    expect(slugify("Knife's Edge!")).toBe('knifes-edge')
  })

  it('trims leading and trailing dashes', () => {
    expect(slugify(' -Santoku- ')).toBe('santoku')
  })

  it('returns an empty string for empty input', () => {
    expect(slugify('')).toBe('')
  })
})

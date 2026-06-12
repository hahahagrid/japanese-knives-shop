import { describe, it, expect } from 'vitest'
import type { Media } from '@/payload-types'
import { asMedia, pickMediaUrl, getCardUrl, getThumbUrl, getBlurDataUrl } from '@/lib/media'

const fullMedia = {
  id: 1,
  url: '/media/original.jpg',
  blurDataUrl: 'data:image/jpeg;base64,abc',
  sizes: {
    thumbnail: { url: '/media/thumb.jpg' },
    card: { url: '/media/card.jpg' },
  },
} as unknown as Media

const noSizesMedia = {
  id: 2,
  url: '/media/original-only.jpg',
} as unknown as Media

describe('asMedia', () => {
  it('returns the object for a populated relationship', () => {
    expect(asMedia(fullMedia)).toBe(fullMedia)
  })

  it('returns null for unpopulated ids and empty values', () => {
    expect(asMedia(5)).toBeNull()
    expect(asMedia('5')).toBeNull()
    expect(asMedia(null)).toBeNull()
    expect(asMedia(undefined)).toBeNull()
  })
})

describe('pickMediaUrl', () => {
  it('returns the first available size from the preference list', () => {
    expect(pickMediaUrl(fullMedia, ['card', 'thumbnail'])).toBe('/media/card.jpg')
    expect(pickMediaUrl(fullMedia, ['thumbnail', 'card'])).toBe('/media/thumb.jpg')
  })

  it('skips missing sizes and falls back to the next preference', () => {
    expect(pickMediaUrl(fullMedia, ['tablet', 'thumbnail'])).toBe('/media/thumb.jpg')
  })

  it('falls back to the original upload url when no sizes exist', () => {
    expect(pickMediaUrl(noSizesMedia, ['card', 'thumbnail'])).toBe('/media/original-only.jpg')
  })

  it('returns null for unpopulated values', () => {
    expect(pickMediaUrl(7, ['card'])).toBeNull()
    expect(pickMediaUrl(null, ['card'])).toBeNull()
  })
})

describe('getCardUrl / getThumbUrl', () => {
  it('getCardUrl prefers the card size', () => {
    expect(getCardUrl(fullMedia)).toBe('/media/card.jpg')
  })

  it('getThumbUrl prefers the thumbnail size', () => {
    expect(getThumbUrl(fullMedia)).toBe('/media/thumb.jpg')
  })
})

describe('getBlurDataUrl', () => {
  it('returns the stored blur placeholder', () => {
    expect(getBlurDataUrl(fullMedia)).toBe('data:image/jpeg;base64,abc')
  })

  it('returns undefined when absent (older media)', () => {
    expect(getBlurDataUrl(noSizesMedia)).toBeUndefined()
    expect(getBlurDataUrl(3)).toBeUndefined()
  })
})

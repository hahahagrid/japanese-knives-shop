import type { Media } from '@/payload-types'

type MediaValue = Media | number | string | null | undefined

type MediaSizeName = 'thumbnail' | 'card' | 'tablet'

/** Narrow a Payload relationship value to a populated Media object. */
export function asMedia(value: MediaValue): Media | null {
  return typeof value === 'object' && value !== null ? value : null
}

/** URL of the first available size in `preference`, falling back to the original upload. */
export function pickMediaUrl(value: MediaValue, preference: MediaSizeName[]): string | null {
  const media = asMedia(value)
  if (!media) return null
  for (const name of preference) {
    const url = media.sizes?.[name]?.url
    if (url) return url
  }
  return media.url ?? null
}

/**
 * Card grids render up to ~480 CSS px wide; the 400px `thumbnail` turns soft on
 * retina screens, so prefer the 800×1000 `card` size.
 */
export const getCardUrl = (value: MediaValue) => pickMediaUrl(value, ['card', 'thumbnail'])

/** Small UI thumbnails: cart rows, sticky bar, gallery strip. */
export const getThumbUrl = (value: MediaValue) => pickMediaUrl(value, ['thumbnail', 'card'])

/** Inline blur placeholder generated at upload time; absent on older media. */
export function getBlurDataUrl(value: MediaValue): string | undefined {
  return asMedia(value)?.blurDataUrl ?? undefined
}

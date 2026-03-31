'use client'

export const customImageLoader = ({ src, width }: { src: string; width: number }) => {
  // src expected: "/images/master1"
  let size = 1200
  if (width <= 640) size = 640
  else if (width <= 1200) size = 1200
  else size = 1920

  return `${src}-${size}.webp`
}

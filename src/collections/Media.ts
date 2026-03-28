import type { CollectionConfig } from 'payload'
import sharp from 'sharp'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation !== 'create' && operation !== 'update') return args
        const file = args?.req?.file
        if (!file || !file.mimetype?.startsWith('image/')) return args
        // Skip if already webp
        if (file.mimetype === 'image/webp') return args

        try {
          const webpBuffer = await sharp(file.data)
            .rotate()
            .resize({
              width: 2560,
              height: 2560,
              fit: 'inside',
              withoutEnlargement: true,
            })
            .webp({ quality: 85 })
            .toBuffer()
          const originalName = path.parse(file.name).name
          args.req.file = {
            ...file,
            data: webpBuffer,
            mimetype: 'image/webp',
            name: `${originalName}.webp`,
            size: webpBuffer.length,
          }
        } catch (e) {
          console.error('WebP conversion failed:', e)
        }
        return args
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'center',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'center',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'tablet',
        width: 1024,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
}

import type { CollectionConfig } from 'payload'
import sharp from 'sharp'
import path from 'path'

const processImage = async (req: any, file: any) => {
  if (!file || !file.mimetype?.startsWith('image/')) return

  try {
    let imageProcessor = sharp(file.data)
      .rotate()
      .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })

    const webpBuffer = await imageProcessor.webp({ quality: 85 }).toBuffer()

    // Replace the file data with the optimized WebP
    if (req.file) {
      req.file.data = webpBuffer
      req.file.mimetype = 'image/webp'
      req.file.name = `${path.parse(file.name).name}.webp`
      req.file.size = webpBuffer.length
    }
  } catch (e) {
    // Silently handle error or log to production error tracker if needed
  }
}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Медіафайл',
    plural: 'Медіафайли',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (operation === 'create' || operation === 'update') {
          if (args.req.file) {
            await processImage(args.req, args.req.file)
          }
        }
        return args
      },
    ],
    beforeChange: [
      async ({ req, operation, data }) => {
        if (operation === 'create') {
          if (req.file) {
            await processImage(req, req.file)
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Альтернативний текст',
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
        height: 500,
        position: 'center',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'card',
        width: 800,
        height: 1000,
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

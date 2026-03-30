import type { CollectionConfig } from 'payload'
import sharp from 'sharp'
import path from 'path'

const processWatermark = async (req: any, file: any) => {
  if (!file || !file.mimetype?.startsWith('image/')) return

  try {
    let imageProcessor = sharp(file.data)
      .rotate()
      .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })

    const wmFile = 'WATERMARK B.png'
    const wmPath = path.resolve(process.cwd(), 'public', wmFile)

    const metadata = await imageProcessor.metadata()
    const width = metadata.width || 2560

    // Full 100% width
    const wmWidth = width

    const wmBuffer = await sharp(wmPath).resize({ width: wmWidth }).toBuffer()

    imageProcessor = imageProcessor.composite([
      {
        input: wmBuffer,
        gravity: 'center',
      },
    ])

    const webpBuffer = await imageProcessor.webp({ quality: 85 }).toBuffer()

    // Replace the file data with the watermarked WebP
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
            await processWatermark(args.req, args.req.file)
          }
        }
        return args
      },
    ],
    beforeChange: [
      async ({ req, operation, data }) => {
        if (operation === 'create') {
          if (req.file) {
            await processWatermark(req, req.file)
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

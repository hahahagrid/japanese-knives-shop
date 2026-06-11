/**
 * Backfills the `blurDataUrl` field for media uploaded before the field existed.
 * New uploads get the placeholder automatically via the Media beforeChange hook.
 *
 * Run on the server that has both the database and the media files:
 *   npx payload run scripts/backfill-blur-placeholders.ts
 */
import { getPayload } from 'payload'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import config from '../src/payload.config'

const MEDIA_DIR = path.resolve(process.cwd(), 'media')

async function run() {
  const payload = await getPayload({ config })

  let page = 1
  let updated = 0
  let skipped = 0
  let missing = 0

  while (true) {
    const res = await payload.find({
      collection: 'media',
      limit: 100,
      page,
      depth: 0,
    })

    for (const doc of res.docs) {
      if (doc.blurDataUrl || !doc.filename || !doc.mimeType?.startsWith('image/')) {
        skipped++
        continue
      }

      const filePath = path.join(MEDIA_DIR, doc.filename)
      if (!fs.existsSync(filePath)) {
        missing++
        console.warn(`[BLUR] File missing on disk, skipping: ${doc.filename}`)
        continue
      }

      try {
        const blurBuffer = await sharp(filePath).resize(16).webp({ quality: 40 }).toBuffer()
        await payload.update({
          collection: 'media',
          id: doc.id,
          data: { blurDataUrl: `data:image/webp;base64,${blurBuffer.toString('base64')}` },
          overrideAccess: true,
        })
        updated++
      } catch (e) {
        console.warn(`[BLUR] Failed to process ${doc.filename}:`, e)
      }
    }

    if (!res.hasNextPage) break
    page++
  }

  console.log(`[BLUR] Done: ${updated} updated, ${skipped} skipped, ${missing} missing files`)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

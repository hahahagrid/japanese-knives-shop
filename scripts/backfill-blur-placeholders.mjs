/**
 * Backfills the `blurDataUrl` field for media uploaded before the field existed.
 * New uploads get the placeholder automatically via the Media beforeChange hook.
 *
 * Plain Node on purpose: the production container prunes devDependencies, so
 * `payload run` (which needs tsx) silently does nothing there. This script only
 * needs `pg` and `sharp` — both production dependencies.
 *
 * Run on the server that has both the database and the media files:
 *   railway ssh -- sh -c "cd /app && node scripts/backfill-blur-placeholders.mjs"
 */
import pg from 'pg'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const MEDIA_DIR = path.resolve(process.cwd(), 'media')

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

const { rows } = await client.query(
  'select id, filename, mime_type from media where blur_data_url is null',
)

let updated = 0
let skipped = 0
let missing = 0
let failed = 0

for (const row of rows) {
  if (!row.filename || !(row.mime_type || '').startsWith('image/')) {
    skipped++
    continue
  }

  const filePath = path.join(MEDIA_DIR, row.filename)
  if (!fs.existsSync(filePath)) {
    missing++
    console.warn(`[BLUR] File missing on disk, skipping: ${row.filename}`)
    continue
  }

  try {
    const blurBuffer = await sharp(filePath).resize(16).webp({ quality: 40 }).toBuffer()
    await client.query('update media set blur_data_url = $1 where id = $2', [
      `data:image/webp;base64,${blurBuffer.toString('base64')}`,
      row.id,
    ])
    updated++
  } catch (e) {
    failed++
    console.warn(`[BLUR] Failed to process ${row.filename}: ${e.message}`)
  }
}

console.log(`[BLUR] Done: ${updated} updated, ${skipped} skipped, ${missing} missing, ${failed} failed`)
await client.end()

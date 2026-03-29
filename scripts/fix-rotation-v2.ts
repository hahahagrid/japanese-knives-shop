import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const IMAGES_DIR = path.join(process.cwd(), 'public/images')
const SIZES = [640, 1200, 1920]
const BASE_NAME = 'phil2'
const INPUT_PATH = path.join(IMAGES_DIR, `${BASE_NAME}.jpg`)

async function rotateAndReoptimize() {
  console.log(`[ROTATOR] Reading ${INPUT_PATH}...`)
  
  // 1. Rotate the original and save it back
  const rotatedBuffer = await sharp(INPUT_PATH)
    .rotate(90) // Rotate 90 degrees clockwise to fix the CCW issue
    .toBuffer()
  
  fs.writeFileSync(INPUT_PATH, rotatedBuffer)
  console.log(`[ROTATOR] Original rotated 90° CW and saved.`)

  // 2. Re-optimize for all sizes
  for (const size of SIZES) {
    const outputPath = path.join(IMAGES_DIR, `${BASE_NAME}-${size}.webp`)
    
    await sharp(rotatedBuffer)
      .resize(size, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outputPath)
    
    console.log(`[ROTATOR] Re-created: ${BASE_NAME}-${size}.webp`)
  }

  console.log('[ROTATOR] Done! Everything is straight now! ✨')
}

rotateAndReoptimize().catch(console.error)

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const IMAGES_DIR = path.join(process.cwd(), 'public/images')
const SIZES = [640, 1200, 1920]

async function optimize() {
  const files = fs.readdirSync(IMAGES_DIR).filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file) && !file.includes('-optimized')
  )

  console.log(`[OPTIMIZER] Found ${files.length} images to process...`)

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file)
    const fileName = path.parse(file).name
    
    console.log(`[OPTIMIZER] Processing ${file}...`)

    for (const size of SIZES) {
      const outputName = `${fileName}-${size}.webp`
      const outputPath = path.join(IMAGES_DIR, outputName)

      await sharp(filePath)
        .resize(size, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outputPath)
      
      console.log(`   - Created: ${outputName}`)
    }
  }

  console.log('[OPTIMIZER] Done! ✨')
}

optimize().catch(console.error)

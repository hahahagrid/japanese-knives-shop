import sharp from 'sharp';
import path from 'path';

const imagesDir = '/Users/abzteam/Desktop/Antigravity/Knives/public/images';
const sizes = [640, 1200, 1920];

async function processImage(filename, baseName) {
  const inputPath = path.join(imagesDir, filename);

  for (const size of sizes) {
    const outputName = `${baseName}-${size}.webp`;
    const outputPath = path.join(imagesDir, outputName);

    try {
      await sharp(inputPath)
        .rotate()
        .resize({ width: size, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outputPath);
      console.log(`Successfully processed ${filename} at ${size}px -> ${outputName}`);
    } catch (err) {
      console.error(`Error processing ${filename} at ${size}px:`, err);
    }
  }
}

async function run() {
  await processImage('master1.JPG', 'master1');
  await processImage('master2.JPG', 'master2');
}

run();

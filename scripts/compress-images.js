const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/**
 * Format bytes to human-readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Compress a single image to WebP format
 */
async function compressImage(inputPath, outputPath) {
  try {
    const stats = await fs.stat(inputPath);
    const originalSize = stats.size;

    await sharp(inputPath)
      .resize(1920, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    const newStats = await fs.stat(outputPath);
    const newSize = newStats.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    console.log(`✅ ${path.basename(inputPath)}`);
    console.log(`   ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${savings}% smaller)`);

    return { originalSize, newSize, savings: parseFloat(savings) };
  } catch (error) {
    console.error(`❌ Failed to compress ${inputPath}:`, error.message);
    return null;
  }
}

/**
 * Recursively find all image files in a directory
 */
async function findImageFiles(directory) {
  const imageFiles = [];
  
  async function scan(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (/\.(jpg|jpeg|png)$/i.test(entry.name) && !entry.name.includes('.webp')) {
        imageFiles.push(fullPath);
      }
    }
  }
  
  await scan(directory);
  return imageFiles;
}

/**
 * Compress all images in a directory
 */
async function compressAllImages(directory) {
  console.log(`\n🔍 Scanning for images in: ${directory}\n`);
  
  const imageFiles = await findImageFiles(directory);
  
  if (imageFiles.length === 0) {
    console.log('❌ No images found to compress!');
    return;
  }
  
  console.log(`📸 Found ${imageFiles.length} images to compress\n`);
  
  let totalOriginal = 0;
  let totalNew = 0;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const inputPath = imageFiles[i];
    const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    console.log(`\n[${i + 1}/${imageFiles.length}] Processing...`);
    
    const result = await compressImage(inputPath, outputPath);
    
    if (result) {
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      successCount++;
    } else {
      failCount++;
    }
  }

  const totalSavings = totalOriginal > 0 
    ? ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1)
    : 0;

  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPRESSION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully compressed: ${successCount} images`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount} images`);
  }
  console.log(`📦 Original size: ${formatBytes(totalOriginal)}`);
  console.log(`📦 Compressed size: ${formatBytes(totalNew)}`);
  console.log(`💾 Total saved: ${formatBytes(totalOriginal - totalNew)} (${totalSavings}%)`);
  console.log('='.repeat(60) + '\n');
}

// Main execution
const targetDirectory = process.argv[2] || './public/photos';

console.log('\n' + '='.repeat(60));
console.log('🖼️  IMAGE COMPRESSION TOOL');
console.log('='.repeat(60));
console.log(`Target: ${targetDirectory}`);
console.log(`Format: WebP (80% quality)`);
console.log(`Max width: 1920px`);
console.log('='.repeat(60));

compressAllImages(targetDirectory)
  .then(() => {
    console.log('✅ All done! Your images are now optimized.\n');
  })
  .catch(err => {
    console.error('\n❌ Error:', err);
    process.exit(1);
  });

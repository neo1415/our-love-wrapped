const fs = require('fs');
const path = require('path');
const convert = require('heic-convert');

async function convertHeicToJpeg(inputPath, outputPath) {
  try {
    const inputBuffer = await fs.promises.readFile(inputPath);
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.9
    });
    await fs.promises.writeFile(outputPath, outputBuffer);
    console.log(`✅ Converted: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
  }
}

async function main() {
  const heicFiles = [
    {
      input: 'lib/Section-5/IMG_7442.HEIC',
      output: 'public/photos/section-5/IMG_7442.jpeg'
    },
    {
      input: 'lib/Section-7/IMG_7447.HEIC',
      output: 'public/photos/section-7/IMG_7447.jpeg'
    },
    {
      input: 'lib/Section-7/IMG_7448.HEIC',
      output: 'public/photos/section-7/IMG_7448.jpeg'
    }
  ];

  console.log('Converting HEIC files to JPEG...\n');
  
  for (const file of heicFiles) {
    await convertHeicToJpeg(file.input, file.output);
  }
  
  console.log('\n✨ All conversions complete!');
}

main();

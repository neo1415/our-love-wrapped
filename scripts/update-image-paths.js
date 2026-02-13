const fs = require('fs').promises;
const path = require('path');

/**
 * Update all image paths in content.config.ts to use .webp extension
 */
async function updateImagePaths() {
  const configPath = './config/content.config.ts';
  
  console.log('\n🔄 Updating image paths to WebP format...\n');
  
  // Read the config file
  let content = await fs.readFile(configPath, 'utf8');
  
  // Count replacements
  let count = 0;
  
  // Replace .jpeg, .jpg, .png with .webp
  content = content.replace(/\.(jpeg|jpg|png)(['"])/gi, (match, ext, quote) => {
    count++;
    return `.webp${quote}`;
  });
  
  // Write back to file
  await fs.writeFile(configPath, content, 'utf8');
  
  console.log(`✅ Updated ${count} image paths to .webp format`);
  console.log(`📝 File: ${configPath}\n`);
}

updateImagePaths()
  .then(() => console.log('✅ Done!\n'))
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });

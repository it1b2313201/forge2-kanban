import fs from 'fs/promises';
import path from 'path';

const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);
const ignoreDirs = new Set(['.git', 'node_modules', 'dist', '.vercel', '.npm-cache', 'frontend/node_modules', 'frontend/dist']);
const outputDir = path.resolve(process.cwd(), 'extracted-screenshots');

async function collectImageFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name) || fullPath.includes(`${path.sep}.git${path.sep}`)) continue;
      results.push(...await collectImageFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (imageExtensions.has(ext)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyImages(imagePaths) {
  await ensureDir(outputDir);

  for (const source of imagePaths) {
    const relative = path.relative(process.cwd(), source);
    const destination = path.join(outputDir, relative);
    await ensureDir(path.dirname(destination));
    await fs.copyFile(source, destination);
  }
}

async function run() {
  const root = process.cwd();
  console.log(`Searching for image files under ${root}`);
  const images = await collectImageFiles(root);

  if (!images.length) {
    console.log('No image files found in the repository.');
    return;
  }

  console.log(`Found ${images.length} image file${images.length === 1 ? '' : 's'}.`);
  await copyImages(images);
  console.log(`Copied ${images.length} image file${images.length === 1 ? '' : 's'} to ${outputDir}`);
}

run().catch(error => {
  console.error('Error extracting screenshots:', error);
  process.exit(1);
});

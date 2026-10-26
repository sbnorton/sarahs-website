import sharp from 'sharp';
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const MANIFEST = 'src/data/photos.json';
const dirs = process.argv.slice(2);
if (!dirs.length) {
  console.error('Usage: node scripts/sync-photos.mjs <photo-folder> [more folders...]');
  process.exit(1);
}

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};

// the purpose of this script is to sync my local photos with the R2 bucket

// Collect every photo file in the given folders
const found = new Map();
for (const dir of dirs) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isFile() || !/\.(jpe?g|png|webp)$/i.test(e.name) || /-small\./.test(e.name)) continue;
    if (found.has(e.name)) console.warn(`Duplicate filename: ${e.name}`);
    found.set(e.name, join(dir, e.name));
  }
}

const titleFromFile = (f) =>
  f
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());

// Add new photos; existing entries (and their alt/tags) are left alone
let added = 0;
for (const [file, path] of found) {
  if (manifest[file]) continue;
  if (!/^[a-z0-9-]+\.(jpe?g|png|webp)$/.test(file)) {
    console.warn(`Rename before uploading (lowercase, hyphens): ${file}`);
  }
  const m = await sharp(path).metadata();
  const rotated = (m.orientation ?? 1) >= 5; // EXIF rotation swaps width/height
  manifest[file] = {
    alt: titleFromFile(file),
    tags: [],
    width: rotated ? m.height : m.width,
    height: rotated ? m.width : m.height,
  };
  added++;
  console.log(`+ ${file}`);
}

for (const file of Object.keys(manifest)) {
  if (!found.has(file)) console.warn(`In manifest but not in the folders: ${file}`);
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`${added} added, ${Object.keys(manifest).length} total`);

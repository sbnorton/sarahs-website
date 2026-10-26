import sharp from 'sharp';
import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dirs = process.argv.slice(2); // e.g. the horizontal and vertical folders
const out = {};

for (const dir of dirs) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !/\.(jpe?g|png|webp)$/i.test(entry.name) || /-small\./.test(entry.name))
      continue;
    const m = await sharp(join(dir, entry.name)).metadata();
    const rotated = (m.orientation ?? 1) >= 5;
    out[`photos/${entry.name}`] = {
      width: rotated ? m.height : m.width,
      height: rotated ? m.width : m.height,
    };
  }
}

writeFileSync('src/data/image-dimensions.json', JSON.stringify(out, null, 2));
console.log(`Wrote ${Object.keys(out).length} entries`);

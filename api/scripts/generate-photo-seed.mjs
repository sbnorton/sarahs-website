import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, '..');
const sourcePath = resolve(projectDirectory, '../src/data/photos.json');
const outputPath = resolve(projectDirectory, 'migrations/0002_seed_photos.sql');

const photos = JSON.parse(await readFile(sourcePath, 'utf8'));
const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;

const statements = Object.entries(photos).map(([file, photo]) => {
	const key = `photos/${file}`;
	const id = quote(file);
	const title = quote(photo.alt);
	const alt = quote(photo.alt);

	return `INSERT INTO photos (id, key, title, alt, width, height, status)
VALUES (${id}, ${quote(key)}, ${title}, ${alt}, ${photo.width}, ${photo.height}, 'ready');`;
});

const sql = `-- Generated from src/data/photos.json. Do not edit by hand.
${statements.join('\n')}
`;

await writeFile(outputPath, sql);
console.log(`Wrote ${statements.length} photo inserts to ${outputPath}`);

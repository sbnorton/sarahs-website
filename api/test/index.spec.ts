import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { beforeAll, describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Photography API', () => {
	beforeAll(async () => {
		await env.photography_metadata.prepare('DROP TABLE IF EXISTS photos').run();
		await env.photography_metadata
			.prepare(
				`
			CREATE TABLE IF NOT EXISTS photos (
				id TEXT PRIMARY KEY,
				key TEXT NOT NULL UNIQUE,
				title TEXT NOT NULL,
				alt TEXT,
				width INTEGER,
				height INTEGER,
				tags TEXT NOT NULL DEFAULT '[]',
				status TEXT NOT NULL DEFAULT 'pending',
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
		`,
			)
			.run();
	});

	it('returns photos from D1 (unit style)', async () => {
		const request = new IncomingRequest('http://example.com');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual([]);
	});

	it('returns photos from D1 (integration style)', async () => {
		const response = await SELF.fetch('https://example.com');
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual([]);
	});

	it('returns ready photos with CORS headers', async () => {
		await env.photography_metadata
			.prepare("INSERT INTO photos (id, key, title, status) VALUES ('photo-1', 'photos/photo.jpg', 'Photo', 'ready')")
			.run();

		const response = await SELF.fetch('https://example.com/photos', {
			headers: { Origin: 'http://localhost:4321' },
		});

		expect(response.status).toBe(200);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:4321');
		expect(await response.json()).toEqual([
			{
				id: 'photo-1',
				key: 'photos/photo.jpg',
				title: 'Photo',
				alt: null,
				width: null,
				height: null,
				status: 'ready',
				tags: [],
			},
		]);
	});

	it('handles CORS preflight requests', async () => {
		const response = await SELF.fetch('https://example.com/photos', {
			method: 'OPTIONS',
			headers: { Origin: 'http://localhost:4321' },
		});

		expect(response.status).toBe(200);
		expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, POST, OPTIONS');
		expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Authorization, Content-Type');
	});

	it('rejects uploads without authentication', async () => {
		const response = await SELF.fetch('https://example.com/photos', {
			method: 'POST',
			body: new FormData(),
		});

		expect(response.status).toBe(401);
	});

	it('rejects unsupported upload file types', async () => {
		const formData = new FormData();
		formData.set('file', new File(['text'], 'notes.txt', { type: 'text/plain' }));

		const response = await SELF.fetch('https://example.com/photos', {
			method: 'POST',
			headers: { Authorization: 'Bearer test-upload-token' },
			body: formData,
		});

		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({
			error: 'Only JPG, JPEG, and PNG files are supported',
		});
	});

	it('uploads an authenticated photo to R2 and D1', async () => {
		const formData = new FormData();
		formData.set('file', new File(['image bytes'], 'new-photo.jpg', { type: 'image/jpeg' }));
		formData.set('title', 'New photo');
		formData.set('alt', 'A new photo');
		formData.set('tags', 'landscape, evening');
		formData.set('width', '1200');
		formData.set('height', '800');

		const response = await SELF.fetch('https://example.com/photos', {
			method: 'POST',
			headers: { Authorization: 'Bearer test-upload-token' },
			body: formData,
		});

		expect(response.status).toBe(201);
		const uploadedPhoto = await response.json();
		expect(uploadedPhoto).toMatchObject({
			title: 'New photo',
			alt: 'A new photo',
			tags: ['landscape', 'evening'],
			status: 'ready',
		});
		expect(uploadedPhoto.key).toMatch(/^photos\/new-photo(?:-[a-f0-9]{8})?\.jpg$/);
		const rows = await env.photography_metadata.prepare("SELECT key, status, tags FROM photos WHERE title = 'New photo'").all();
		expect(rows.results).toHaveLength(1);
		expect(rows.results[0]).toMatchObject({ status: 'ready', tags: '["landscape","evening"]' });

		const photosResponse = await SELF.fetch('https://example.com/photos');
		expect(await photosResponse.json()).toContainEqual(
			expect.objectContaining({
				title: 'New photo',
				tags: ['landscape', 'evening'],
			}),
		);
	});
});

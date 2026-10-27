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
});

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const origin = request.headers.get('Origin');
		const allowedOrigin = origin === env.SITE_ORIGIN || origin === 'http://localhost:4321' ? origin : null;

		if (url.pathname === '/photos') {
			if (request.method === 'OPTIONS') {
				return new Response(null, {
					headers: corsHeaders(allowedOrigin),
				});
			}

			if (request.method === 'POST') {
				const authResponse = requireUploadAuth(request, env, allowedOrigin);
				if (authResponse) {
					return authResponse;
				}

				return uploadPhoto(request, env, allowedOrigin);
			}

			if (request.method !== 'GET') {
				return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders(allowedOrigin) });
			}

			const { results } = await env.photography_metadata
				.prepare("SELECT id, key, title, alt, width, height, tags, status FROM photos WHERE status = 'ready' ORDER BY created_at DESC")
				.all();

			return Response.json(
				results.map((photo) => ({
					...photo,
					tags: parseTags(photo.tags),
				})),
				{
					headers: corsHeaders(allowedOrigin),
				},
			);
		}

		const { results } = await env.photography_metadata
			.prepare('SELECT id, key, title, status FROM photos ORDER BY created_at DESC LIMIT 20')
			.all();

		return Response.json(results);
	},
} satisfies ExportedHandler<Env>;

type UploadEnv = Env & { UPLOAD_TOKEN?: string };

async function uploadPhoto(request: Request, env: Env, origin: string | null): Promise<Response> {
	try {
		const formData = await request.formData();
		const file = formData.get('file');
		if (!(file instanceof File)) {
			return Response.json({ error: 'A file is required' }, { status: 400, headers: corsHeaders(origin) });
		}

		if (!isSupportedImage(file)) {
			return Response.json({ error: 'Only JPG, JPEG, and PNG files are supported' }, { status: 400, headers: corsHeaders(origin) });
		}

		const maxFileSize = 25 * 1024 * 1024;
		if (file.size === 0 || file.size > maxFileSize) {
			return Response.json({ error: 'Image must be between 1 byte and 25 MB' }, { status: 400, headers: corsHeaders(origin) });
		}

		const title = textField(formData, 'title') || file.name;
		const alt = textField(formData, 'alt') || title;
		const tags = parseUploadTags(formData.get('tags'));
		const width = numberField(formData, 'width');
		const height = numberField(formData, 'height');
		const id = crypto.randomUUID();
		const extension = extensionFor(file);
		const key = await photoKey(env.PHOTOS_BUCKET, title, extension);

		await env.PHOTOS_BUCKET.put(key, file.stream(), {
			httpMetadata: { contentType: file.type },
		});

		try {
			await env.photography_metadata
				.prepare('INSERT INTO photos (id, key, title, alt, width, height, tags, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
				.bind(id, key, title, alt, width, height, JSON.stringify(tags), 'ready')
				.run();
		} catch (error) {
			await env.PHOTOS_BUCKET.delete(key);
			throw error;
		}

		return Response.json({ id, key, title, alt, width, height, tags, status: 'ready' }, { status: 201, headers: corsHeaders(origin) });
	} catch (error) {
		console.error('Photo upload failed', error);
		return Response.json({ error: 'Photo upload failed' }, { status: 500, headers: corsHeaders(origin) });
	}
}

function requireUploadAuth(request: Request, env: Env, origin: string | null): Response | null {
	const uploadToken = (env as UploadEnv).UPLOAD_TOKEN;
	if (!uploadToken) {
		return Response.json({ error: 'Upload authentication is not configured' }, { status: 503, headers: corsHeaders(origin) });
	}

	const authorization = request.headers.get('Authorization');
	if (authorization !== `Bearer ${uploadToken}`) {
		return Response.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders(origin) });
	}

	return null;
}

function textField(formData: FormData, name: string): string | null {
	const value = formData.get(name);
	return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function numberField(formData: FormData, name: string): number | null {
	const value = textField(formData, name);
	if (!value) {
		return null;
	}

	const number = Number(value);
	return Number.isInteger(number) && number > 0 ? number : null;
}

function parseUploadTags(value: string | File | null): string[] {
	if (typeof value !== 'string') {
		return [];
	}

	return value
		.split(',')
		.map((tag) => tag.trim())
		.filter(Boolean)
		.slice(0, 20);
}

function parseTags(value: unknown): string[] {
	if (typeof value !== 'string') {
		return [];
	}

	try {
		const parsed: unknown = JSON.parse(value);
		return Array.isArray(parsed) && parsed.every((tag) => typeof tag === 'string') ? parsed : [];
	} catch {
		return [];
	}
}

function extensionFor(file: File): string {
	return `.${file.name.split('.').pop()?.toLowerCase() ?? 'jpg'}`;
}

function isSupportedImage(file: File): boolean {
	const extension = file.name.split('.').pop()?.toLowerCase();
	return (
		((extension === 'jpg' || extension === 'jpeg') && file.type === 'image/jpeg') || (extension === 'png' && file.type === 'image/png')
	);
}

async function photoKey(bucket: R2Bucket, title: string, extension: string): Promise<string> {
	const slug = title
		.normalize('NFKD')
		.replace(/[^\w\s-]/g, '')
		.trim()
		.toLowerCase()
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
	const baseName = slug || 'photo';
	const baseKey = `photos/${baseName}${extension}`;

	if (!(await bucket.head(baseKey))) {
		return baseKey;
	}

	return `photos/${baseName}-${crypto.randomUUID().slice(0, 8)}${extension}`;
}

function corsHeaders(origin: string | null): HeadersInit {
	return {
		...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Authorization, Content-Type',
		Vary: 'Origin',
	};
}

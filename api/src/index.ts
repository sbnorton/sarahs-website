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

			if (request.method !== 'GET') {
				return Response.json({ error: 'Method not allowed' }, { status: 405 });
			}

			const { results } = await env.photography_metadata
				.prepare("SELECT id, key, title, alt, width, height, status FROM photos WHERE status = 'ready' ORDER BY created_at DESC")
				.all();

			return Response.json(
				results.map((photo) => ({
					...photo,
					tags: [],
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

function corsHeaders(origin: string | null): HeadersInit {
	return {
		...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		Vary: 'Origin',
	};
}

export const MAX_MESSAGE_LENGTH = 2000;

export interface ContactInput {
	name: string;
	email: string;
	message: string;
	website: string;
	turnstileToken: string;
}

export type ContactValidation = { valid: true; value: ContactInput } | { valid: false; error: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseContactInput(body: unknown): ContactValidation {
	if (!body || typeof body !== 'object' || Array.isArray(body)) {
		return { valid: false, error: 'Request must contain a JSON object' };
	}

	const input = body as Record<string, unknown>;
	const fields = ['name', 'email', 'message', 'website', 'turnstileToken'] as const;
	if (fields.some((field) => typeof input[field] !== 'string')) {
		return { valid: false, error: 'Name, email, message, and spam protection are required' };
	}

	const value: ContactInput = {
		name: input.name.trim(),
		email: input.email.trim(),
		message: input.message.trim(),
		website: input.website.trim(),
		turnstileToken: input.turnstileToken.trim(),
	};

	if (value.website) return { valid: true, value };
	if (!value.name || !value.email || !value.message || !value.turnstileToken) {
		return { valid: false, error: 'Name, email, message, and spam protection are required' };
	}
	if (!emailPattern.test(value.email) || value.email.length > 254) {
		return { valid: false, error: 'Please provide a valid email address' };
	}
	if (value.name.length > 100) return { valid: false, error: 'Name must be 100 characters or fewer' };
	if (value.message.length > MAX_MESSAGE_LENGTH) {
		return { valid: false, error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer` };
	}

	return { valid: true, value };
}

import { z } from 'zod';

import type { APIKeys } from '../../../types';

const inputSchema = z.object({
	prompt: z.string(),
	// response_format: z.enum(['b64_json', 'url']).default('b64_json'),
	size: z.enum(['256x256', '512x512', '1024x1024']).default('512x512'),
});

const outputSchema = z.object({
	url: z.string().url(),
});

export async function dalleUrlTextToImage(
	input: z.input<typeof inputSchema>,
	apiKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	const endpoint = `https://api.openai.com/v1/images/generations`;
	const response = await fetch(endpoint, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKeys.openai!}`,
		},
		method: 'POST',
		body: JSON.stringify(payload),
	});

	const { data } = await response.json();

	return {
		url: data[0].url,
	};
}

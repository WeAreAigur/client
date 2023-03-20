import { z } from 'zod';

import type { APIKeys } from '../../../types';

export const inputSchema = z.object({
	prompt: z.string(),
	response_format: z.literal('b64_json').default('b64_json'),
	size: z.enum(['256x256', '512x512', '1024x1024']).default('512x512'),
});

export const outputSchema = z.object({
	result: z.string().describe('base64'),
});

export async function dalleBase64TextToImage(
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
		result: data[0].b64_json,
	};
}

export const name = 'dalleBase64TextToImage';

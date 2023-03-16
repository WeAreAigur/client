import { z } from 'zod';

import type { APIKeys } from '../../../types';

export const inputSchema = z
	.object({
		messages: z.array(
			z.object({
				role: z.enum(['user', 'system', 'assistant']).or(z.string()),
				content: z.string(),
			})
		),
		model: z.enum(['gpt-4', 'gpt-4-32k']).or(z.string()).default('gpt-4'),
		temperature: z.number().min(0).max(2).default(0.7),
		top_p: z.number().min(0).max(1).default(1),
		frequency_penalty: z.number().min(-2).max(2).default(0),
		presence_penalty: z.number().min(-2).max(2).default(0),
		max_tokens: z.number().default(200),
		n: z.number().default(1),
	})
	.strict();

export const outputSchema = z.object({
	text: z.string(),
});

export async function gpt4Prediction(
	input: z.input<typeof inputSchema>,
	apiKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	const endpoint = 'https://api.openai.com/v1/chat/completions';
	const response = await fetch(endpoint, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKeys.openai}`,
		},
		method: 'POST',
		body: JSON.stringify(payload),
	});

	const output = await response.json();
	const text = output.choices[0]?.message.content;
	return { text: text.replace(/^(?:\n)+/gm, '') };
}

export const name = 'gpt4Prediction';

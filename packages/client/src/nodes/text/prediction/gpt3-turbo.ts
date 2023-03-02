import { z } from 'zod';

import type { APIKeys } from '../../../types';

export const inputSchema = z.object({
	messages: z
		.array(
			z.object({
				role: z.enum(['user', 'system', 'assistant']),
				content: z.string(),
			})
		)
		.nonempty(),
	model: z.enum(['gpt-3.5-turbo']).default('gpt-3.5-turbo'),
	temperature: z.number().min(0).max(2).default(0.7),
	top_p: z.number().min(0).max(1).default(1),
	frequency_penalty: z.number().min(-2).max(2).default(0),
	presence_penalty: z.number().min(-2).max(2).default(0),
	max_tokens: z.number().default(200),
	n: z.number().default(1),
});

export const outputSchema = z.object({
	text: z.string(),
});

export async function gpt3TurboPrediction(
	input: z.input<typeof inputSchema>,
	apiKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKeys.openai}`,
		},
		method: 'POST',
		body: JSON.stringify(payload),
	});

	const output = await response.json();
	return { text: output.choices[0]?.message.content.replace(/^(?:\n)+/gm, '') };
}

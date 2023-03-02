import { z } from 'zod';

import type { APIKeys } from '../../../types';

export const rawInputSchema = z
	.object({
		prompt: z.string(),
		model: z
			.enum([
				'text-davinci-003',
				'text-curie-001',
				'text-babbage-001',
				'text-ada-001',
				'code-davinci-002',
				'code-cushman-002',
				'gpt-3.5-turbo',
			])
			.default('gpt-3.5-turbo'),
		temperature: z.number().min(0).max(2).default(0.7),
		top_p: z.number().min(0).max(1).default(1),
		frequency_penalty: z.number().min(-2).max(2).default(0),
		presence_penalty: z.number().min(-2).max(2).default(0),
		max_tokens: z.number().default(200),
		n: z.number().default(1),
	})
	.strict();

export const turboTransformer = <T>(
	val
): T | (Omit<T, 'prompt'> & { messages: Array<{ role: string; content: string }> }) => {
	// gpt 3.5 turbo has a different prompt schema
	if (val.model === 'gpt-3.5-turbo') {
		const { prompt, ...rest } = val;
		return {
			...rest,
			messages: [
				{
					role: 'user',
					content: val.prompt,
				},
			],
		};
	}
	return val;
};

const inputSchema = rawInputSchema.transform((val) =>
	turboTransformer<z.input<typeof rawInputSchema>>(val)
);

export const outputSchema = z.object({
	text: z.string(),
});

export async function gpt3Prediction(
	input: z.input<typeof inputSchema>,
	apiKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	const endpoint =
		payload.model === 'gpt-3.5-turbo'
			? 'https://api.openai.com/v1/chat/completions'
			: 'https://api.openai.com/v1/completions';
	const response = await fetch(endpoint, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKeys.openai}`,
		},
		method: 'POST',
		body: JSON.stringify(payload),
	});

	const output = await response.json();
	const text =
		payload.model === 'gpt-3.5-turbo' ? output.choices[0]?.message.content : output.choices[0].text;
	return { text: text.replace(/^(?:\n)+/gm, '') };
}

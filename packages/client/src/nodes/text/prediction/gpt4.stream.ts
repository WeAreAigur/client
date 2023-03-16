import { z } from 'zod';

import { inputSchema as gpt4BaseInputSchema } from './gpt4';
import { OpenAIStream } from './openaiStream';

import type { APIKeys } from '../../../types';
export const inputSchema = gpt4BaseInputSchema.merge(
	z.object({
		stream: z.literal(true).optional().default(true),
	})
);

export const outputSchema = z.object({
	stream: z.instanceof(globalThis.ReadableStream ?? Object),
});

export async function gpt4PredictionStream(
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

	const stream = await OpenAIStream(response);
	return { stream };
}

export const name = 'gpt4PredictionStream';

import { z } from 'zod';

import { OpenAIStream } from './openaiStream';
import { inputSchema as gpt3TurboBaseInputSchema } from './gpt3-turbo';

import type { APIKeys } from '../../../types';
export const inputSchema = gpt3TurboBaseInputSchema.merge(
	z.object({
		stream: z.literal(true).optional().default(true),
	})
);

export const outputSchema = z.object({
	stream: z.instanceof(globalThis.ReadableStream ?? Object),
});

export async function gpt3TurboPredictionStream(
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

export const name = 'gpt3TurboPredictionStream';

import { z } from 'zod';
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

import { gpt3TurboInputSchema as gpt3TurboBaseInputSchema } from './gpt3-turbo';

import type { APIKeys } from '../../../types';
const inputSchema = gpt3TurboBaseInputSchema.merge(
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

async function OpenAIStream(response: Response) {
	const encoder = new TextEncoder();
	const decoder = new TextDecoder();

	let counter = 0;

	const stream = new ReadableStream({
		async start(controller) {
			function onParse(event: ParsedEvent | ReconnectInterval) {
				if (event.type === 'event') {
					const data = event.data;
					if (data === '[DONE]') {
						controller.close();
						return;
					}
					try {
						const json = JSON.parse(data);
						const text = json.choices[0]?.delta.content;
						const queue = encoder.encode(text);
						controller.enqueue(queue);
						counter++;
					} catch (e) {
						controller.error(e);
					}
				}
			}

			const parser = createParser(onParse);
			for await (const chunk of response.body as any) {
				parser.feed(decoder.decode(chunk));
			}
		},
	});

	return stream;
}

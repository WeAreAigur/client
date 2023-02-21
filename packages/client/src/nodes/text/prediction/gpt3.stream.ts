import { z } from 'zod';
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

import { inputSchema as gpt3BaseInputSchema } from './gpt3';

import type { APIKeys } from '../../../types';

const inputSchema = gpt3BaseInputSchema.merge(
	z.object({
		stream: z.literal(true).optional().default(true),
	})
);

const outputSchema = z.object({
	stream: z.instanceof(globalThis.ReadableStream<string> ?? Object),
});

export async function gpt3PredictionStream(
	input: z.input<typeof inputSchema>,
	apiKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	const response = await fetch('https://api.openai.com/v1/completions', {
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
						const text = json.choices[0].text;
						if (counter < 2 && (text.match(/\n/) || []).length) {
							return;
						}
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

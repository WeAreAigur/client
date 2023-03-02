import { z } from 'zod';
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

import { rawInputSchema as gpt3BaseInputSchema, turboTransformer } from './gpt3';

import type { APIKeys } from '#/types';

const rawIinputSchema = gpt3BaseInputSchema
	.merge(
		z.object({
			stream: z.literal(true).optional().default(true),
		})
	)
	.strict();

const inputSchema = rawIinputSchema.transform((val) =>
	turboTransformer<z.input<typeof gpt3BaseInputSchema>>(val)
);

const outputSchema = z.object({
	stream: z.instanceof(globalThis.ReadableStream ?? Object),
});

export async function gpt3PredictionStream(
	input: z.input<typeof inputSchema>,
	apiKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	const endpoint =
		payload.model === 'gpt-3.5-turbo'
			? 'https://api.openai.com/v1/chat/completions'
			: 'https://api.openai.com/v1/completions';
	console.log(`***endpoint`, endpoint);
	const response = await fetch(endpoint, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKeys.openai}`,
		},
		method: 'POST',
		body: JSON.stringify(payload),
	});

	const stream = await OpenAIStream(payload, response);
	return { stream };
}

async function OpenAIStream(
	payload:
		| z.input<typeof inputSchema>
		| (Omit<z.input<typeof inputSchema>, 'prompt'> & {
				messages: Array<{ role: string; content: string }>;
		  }),
	response: Response
) {
	const encoder = new TextEncoder();
	const decoder = new TextDecoder();

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
						const text =
							payload.model === 'gpt-3.5-turbo'
								? json.choices[0]?.delta.content
								: json.choices[0].text;
						const queue = encoder.encode(text);
						controller.enqueue(queue);
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

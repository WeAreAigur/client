import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

export async function OpenAIStream(response: Response) {
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
						const text = json.choices[0]?.delta.content;
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

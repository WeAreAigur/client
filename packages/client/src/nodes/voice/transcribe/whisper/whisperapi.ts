import { z } from 'zod';
import { APIKeys } from '#/types';

const endpoint = 'https://transcribe.whisperapi.com';

const inputSchema = z.object({
	audioUrl: z.string().url(),
});

const outputSchema = z.object({
	text: z.string(),
});

async function action(
	input: z.input<typeof inputSchema>,
	apiKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	const form = new FormData();
	form.append('url', payload.audioUrl);
	form.append('language', 'en');
	form.append('fileType', 'mp3');
	form.append('task', 'transcribe');

	const result = await fetch(endpoint, {
		method: 'POST',
		headers: {
			contentType: 'application/json',
			Authorization: 'Bearer ' + apiKeys.whisperapi,
		},
		body: form,
	});

	if (!result.ok) {
		throw new Error(result.statusText);
	}

	const data = await result.json();

	console.log(`***data`, data);

	return { text: data.text.trim() };
}

export const whisperApiNode = {
	id: 'voice.transcribe.whisper.whisperapi',
	schema: {
		input: inputSchema,
		output: outputSchema,
	},
	action,
};

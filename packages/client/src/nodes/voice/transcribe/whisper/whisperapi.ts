import { z } from 'zod';

import type { APIKeys } from '../../../../types';

const endpoint = 'https://transcribe.whisperapi.com';

const inputSchema = z.object({
	audioUrl: z.string().url(),
	language: z.string().default('en'),
	autoDetectLanguage: z.boolean().default(false),
	fileType: z.string().default('mp3'),
	task: z.enum(['transcribe', 'translate']).default('transcribe'),
});

const outputSchema = z.object({
	text: z.string(),
});

export async function whisperApiNode(
	input: z.input<typeof inputSchema>,
	apiKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	const form = new FormData();
	form.append('url', payload.audioUrl);
	if (!payload.autoDetectLanguage) {
		form.append('language', payload.language);
	}
	form.append('fileType', payload.fileType);
	form.append('task', payload.task);

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
	return { text: data.text.trim() };
}

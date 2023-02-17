import { z } from 'zod';

import { APIKeys } from '../../../types';

const inputSchema = z.object({
	text: z.string(),
	speakingRate: z.number().min(0.25).max(4).optional().default(1),
	pitch: z.number().min(-20).max(20).optional().default(0),
	encoding: z
		.enum([
			'MP3',
			'FLAC',
			'LINEAR16',
			'MULAW',
			'AMR',
			'AMR_WB',
			'OGG_OPUS',
			'SPEEX_WITH_HEADER_BYTE',
			'WEBM_OPUS',
		])
		.optional()
		.default('MP3'),
	voice: z
		.object({
			language: z.string().optional().default('en-US'),
			name: z
				.enum([
					'en-US-Standard-A',
					'en-US-Standard-C',
					'en-US-Standard-D',
					'en-US-Standard-E',
					'en-US-Standard-F',
					'en-US-Standard-G',
					'en-US-Standard-H',
					'en-US-Standard-I',
					'en-US-Standard-J',
					'en-US-Studio-M',
					'en-US-Studio-O',
					'en-US-Wavenet-A',
					'en-US-Wavenet-B',
					'en-US-Wavenet-C',
					'en-US-Wavenet-D',
					'en-US-Wavenet-E',
					'en-US-Wavenet-F',
					'en-US-Wavenet-G',
					'en-US-Wavenet-H',
					'en-US-Wavenet-I',
					'en-US-Wavenet-J',
					'en-US-News-K',
					'en-US-News-L',
					'en-US-News-M',
					'en-US-News-N',
					'en-US-Standard-A',
					'en-US-Standard-B',
					'en-US-Standard-C',
					'en-US-Standard-D',
					'en-US-Standard-E',
					'en-US-Standard-F',
					'en-US-Standard-G',
					'en-US-Standard-H',
					'en-US-Standard-I',
					'en-US-Standard-J',
				])
				.or(z.string())
				.optional()
				.default('en-US-Neural2-C'),
		})
		.optional()
		.default({
			language: 'en-US',
			name: 'en-US-Neural2-C',
		}),
});

const outputSchema = z.object({
	audio: z.string(), // base64
});

export const googleTextToSpeechNode =
	(input: z.input<typeof inputSchema>) =>
	async (apiKeys: APIKeys): Promise<z.infer<typeof outputSchema>> => {
		const parsedInput = inputSchema.parse(input);
		const endpoint = `https://us-central1-texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKeys.googleapis}`;
		const payload = {
			input: {
				text: parsedInput.text,
			},
			voice: {
				languageCode: parsedInput.voice.language,
				name: parsedInput.voice.name,
			},
			audioConfig: {
				audioEncoding: parsedInput.encoding,
				speakingRate: parsedInput.speakingRate,
				pitch: parsedInput.pitch,
			},
		};

		const result = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});
		const data = await result.json();
		return {
			audio: data.audioContent,
		};
	};

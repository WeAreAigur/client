import { z } from 'zod';

import { HfInference } from '@huggingface/inference';

import { optionsSchema } from './huggingface';
import { APIKeys } from '../../types';

// TODO: check if array buffer works instead of regular buffer
export const inputSchema = z.object({
	model: z.string(),
	/**
	 * Binary audio data
	 */
	data: z.instanceof(ArrayBuffer).describe('ArrayBuffer'),
	options: optionsSchema,
});

export const outputSchema = z.object({
	text: z.string(),
});

export async function automaticSpeechRecognition(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const { text } = await hf.automaticSpeechRecognition(payload, options);
	return { text };
}

export const name = 'automaticSpeechRecognition';

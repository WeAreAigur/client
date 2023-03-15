import { z } from 'zod';

import { HfInference } from '@huggingface/inference';

import { APIKeys } from '../../types';
import { optionsSchema } from './huggingface';

export const inputSchema = z.object({
	model: z.string(),
	/**
	 * A string to be translated
	 */
	inputs: z.string(),
	options: optionsSchema,
});

export const outputSchema = z.object({
	/**
	 * The string after translation
	 */
	translation_text: z.string(),
});

export async function translation(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const { translation_text } = await hf.translation(payload, options);
	return {
		translation_text,
	};
}

export const name = 'translation';

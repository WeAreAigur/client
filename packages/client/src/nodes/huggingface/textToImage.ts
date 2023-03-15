import { z } from 'zod';

import { HfInference } from '@huggingface/inference';

import { optionsSchema } from '../huggingface';
import { APIKeys } from '../../types';

export const inputSchema = z.object({
	model: z.string(),
	/**
	 * The text to generate an image from
	 */
	inputs: z.string(),
	/**
	 * An optional negative prompt for the image generation
	 */
	negative_prompt: z.string().optional(),
	options: optionsSchema,
});

export const outputSchema = z.object({
	result: z.instanceof(global.ArrayBuffer ?? Object),
});

export async function textToImage(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const result = await hf.textToImage(payload, options);
	return {
		result,
	};
}

export const name = 'textToImage';

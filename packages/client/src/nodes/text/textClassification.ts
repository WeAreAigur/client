import { APIKeys } from '#/types';
import { z } from 'zod';

import { HfInference } from '@huggingface/inference';

import { optionsSchema } from '../huggingface';

export const inputSchema = z.object({
	model: z.string(),
	/**
	 * A string to be classified
	 */
	inputs: z.string(),
	options: optionsSchema,
});

export const outputSchema = z.object({
	results: z
		.object({
			/**
			 * The label for the class (model specific)
			 */
			label: z.string(),
			/**
			 * A floats that represents how likely is that the text belongs to this class.
			 */
			score: z.number(),
		})
		.array(),
});

export async function textClassification(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const results = await hf.textClassification(payload, options);
	return {
		results,
	};
}

export const name = 'textClassification';

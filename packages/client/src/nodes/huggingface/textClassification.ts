import { z } from 'zod';

import { HfInference } from '@huggingface/inference';

import { APIKeys } from '../../types';
import { optionsSchema } from './huggingface';

export const inputSchema = z.object({
	model: z.string(),
	/**
	 * A string to be classified
	 */
	inputs: z.string(),
	options: optionsSchema,
});

export const outputSchema = z.object({
	result: z.array(
		z.object({
			/**
			 * The label for the class (model specific)
			 */
			label: z.string(),
			/**
			 * A floats that represents how likely is that the text belongs to this class.
			 */
			score: z.number(),
		})
	),
});

export async function textClassification(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const result = await hf.textClassification(payload, options);
	return {
		result,
	};
}

export const name = 'textClassification';

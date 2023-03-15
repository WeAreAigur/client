import { z } from 'zod';

import { HfInference } from '@huggingface/inference';

import { APIKeys } from '../../types';
import { optionsSchema } from './huggingface';

export const inputSchema = z.object({
	model: z.string(),
	inputs: z.string(),
	options: optionsSchema,
});

export const outputSchema = z.object({
	result: z.array(
		z.object({
			/**
			 * The probability for this token.
			 */
			score: z.number(),
			/**
			 * The actual sequence of tokens that ran against the model (may contain special tokens)
			 */
			sequence: z.string(),
			/**
			 * The id of the token
			 */
			token: z.number(),
			/**
			 * The string representation of the token
			 */
			token_str: z.string(),
		})
	),
});

export async function fillMask(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const result = await hf.fillMask(payload, options);
	return {
		result,
	};
}

export const name = 'fillMask';

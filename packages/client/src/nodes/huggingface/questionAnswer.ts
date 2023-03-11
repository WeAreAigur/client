import { z } from 'zod';

import { HfInference } from '@huggingface/inference';

import { APIKeys } from '../../types';
import { optionsSchema } from '../huggingface';

export const inputSchema = z.object({
	model: z.string(),
	inputs: z.object({
		context: z.string(),
		question: z.string(),
	}),
	options: optionsSchema,
});

export const outputSchema = z.object({
	/**
	 * A string that’s the answer within the text.
	 */
	answer: z.string(),
	/**
	 * The index (string wise) of the stop of the answer within context.
	 */
	end: z.number(),
	/**
	 * A float that represents how likely that the answer is correct
	 */
	score: z.number(),
	/**
	 * The index (string wise) of the start of the answer within context.
	 */
	start: z.number(),
});

export async function questionAnswer(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const results = await hf.questionAnswer(payload, options);
	return results;
}

export const name = 'questionAnswer';

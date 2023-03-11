import { APIKeys } from '#/types';
import { z } from 'zod';

import { HfInference } from '@huggingface/inference';

import { optionsSchema } from '../huggingface';

export const inputSchema = z.object({
	model: z.string(),
	inputs: z.object({
		/**
		 * The query in plain text that you want to ask the table
		 */
		query: z.string(),
		/**
		 * A table of data represented as a dict of list where entries are headers and the lists are all the values, all lists must have the same size.
		 */
		table: z.record(z.string().array()),
	}),
	options: optionsSchema,
});

export const outputSchema = z.object({
	/**
	 * The aggregator used to get the answer
	 */
	aggregator: z.string(),
	/**
	 * The plaintext answer
	 */
	answer: z.string(),
	/**
	 * A list of coordinates of the cells contents
	 */
	cells: z.string().array(),
	/**
	 * a list of coordinates of the cells referenced in the answer
	 */
	coordinates: z.number().array().array(),
});

export async function tableQuestionAnswer(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const results = await hf.tableQuestionAnswer(payload, options);
	return results;
}

export const name = 'tableQuestionAnswer';

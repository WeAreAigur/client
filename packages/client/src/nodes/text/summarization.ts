import { APIKeys } from '#/types';
import { z } from 'zod';

import { HfInference } from '@huggingface/inference';

import { optionsSchema } from '../huggingface';

export const inputSchema = z.object({
	model: z.string(),
	/**
	 * A string to be summarized
	 */
	inputs: z.string(),
	parameters: z
		.object({
			/**
			 * (Default: None). Integer to define the maximum length in tokens of the output summary.
			 */
			max_length: z.number().int().optional(),
			/**
			 * (Default: None). Float (0-120.0). The amount of time in seconds that the query should take maximum. Network can cause some overhead so it will be a soft limit.
			 */
			max_time: z.number().min(0).max(120).optional(),
			/**
			 * (Default: None). Integer to define the minimum length in tokens of the output summary.
			 */
			min_length: z.number().int().optional(),
			/**
			 * (Default: None). Float (0.0-100.0). The more a token is used within generation the more it is penalized to not be picked in successive generation passes.
			 */
			repetition_penalty: z.number().min(0).max(100).optional(),
			/**
			 * (Default: 1.0). Float (0.0-100.0). The temperature of the sampling operation. 1 means regular sampling, 0 means always take the highest score, 100.0 is getting closer to uniform probability.
			 */
			temperature: z.number().min(0).max(100).optional().default(1),
			/**
			 * (Default: None). Integer to define the top tokens considered within the sample operation to create new text.
			 */
			top_k: z.number().int().optional(),
			/**
			 * (Default: None). Float to define the tokens that are within the sample operation of text generation. Add tokens in the sample for more probable to least probable until the sum of the probabilities is greater than top_p.
			 */
			top_p: z.number().optional(),
		})
		.optional(),
	options: optionsSchema,
});

export const outputSchema = z.object({
	summary_text: z.string(),
});

export async function summarization(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const { summary_text } = await hf.summarization(payload, options);
	return {
		summary_text,
	};
}

export const name = 'summarization';

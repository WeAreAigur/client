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
	parameters: z
		.object({
			/**
			 * (Optional: True). Bool. Whether or not to use sampling, use greedy decoding otherwise.
			 */
			do_sample: z.boolean().optional().default(true),
			/**
			 * (Default: None). Int (0-250). The amount of new tokens to be generated, this does not include the input length it is a estimate of the size of generated text you want. Each new tokens slows down the request, so look for balance between response times and length of text generated.
			 */
			max_new_tokens: z.number().int().min(0).max(250).optional(),
			/**
			 * (Default: None). Float (0-120.0). The amount of time in seconds that the query should take maximum. Network can cause some overhead so it will be a soft limit. Use that in combination with max_new_tokens for best results.
			 */
			max_time: z.number().min(0).max(120).optional(),
			/**
			 * (Default: 1). Integer. The number of proposition you want to be returned.
			 */
			num_return_sequences: z.number().int().min(0).optional().default(1),
			/**
			 * (Default: None). Float (0.0-100.0). The more a token is used within generation the more it is penalized to not be picked in successive generation passes.
			 */
			repetition_penalty: z.number().min(0).max(100).optional(),
			/**
			 * (Default: True). Bool. If set to False, the return results will not contain the original query making it easier for prompting.
			 */
			return_full_text: z.boolean().optional().default(true),
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
	generated_text: z.string(),
});

export async function textGeneration(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const { generated_text } = await hf.textGeneration(payload, options);
	return {
		generated_text,
	};
}

export const name = 'textGeneration';

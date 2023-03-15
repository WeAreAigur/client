import { z } from 'zod';

import { HfInference } from '@huggingface/inference';

import { optionsSchema } from '../huggingface';
import { APIKeys } from '../../types';

export const inputSchema = z.object({
	model: z.string(),
	/**
	 * The inputs vary based on the model. For example when using sentence-transformers/paraphrase-xlm-r-multilingual-v1 the inputs will look like this:
	 *
	 *  inputs: &#123;
	 *    "source_sentence": "That is a happy person",
	 *    "sentences": ["That is a happy dog", "That is a very happy person", "Today is a sunny day"]
	 *  &#125;
	 */
	inputs: z.record(z.string(), z.any()).or(z.record(z.string(), z.any()).array()),
	options: optionsSchema,
});

export const outputSchema = z.object({
	result: z.array(z.number().or(z.number().array())),
});

export async function featureExtraction(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const result = await hf.featureExtraction(payload, options);
	return { result };
}

export const name = 'featureExtraction';

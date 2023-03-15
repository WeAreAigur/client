import { z } from 'zod';

import { HfInference } from '@huggingface/inference';

import { APIKeys } from '../../types';
import { optionsSchema } from './huggingface';

export const inputSchema = z.object({
	model: z.string(),
	/**
	 * Binary audio data
	 */
	data: z.instanceof(ArrayBuffer),
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
			 * A float that represents how likely it is that the audio file belongs to this class.
			 */
			score: z.number(),
		})
	),
});

export async function audioClassification(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const result = await hf.audioClassification(payload, options);
	return { result };
}

export const name = 'audioClassification';

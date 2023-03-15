import { z } from 'zod';

import { HfInference } from '@huggingface/inference';

import { APIKeys } from '../../types';
import { optionsSchema } from './huggingface';

export const inputSchema = z.object({
	model: z.string(),
	/**
	 * Binary image data
	 */
	data: z.instanceof(ArrayBuffer),
	options: optionsSchema,
});

export const outputSchema = z.object({
	result: z.array(
		z.object({
			/**
			 * The label for the class (model specific) of a segment.
			 */
			label: z.string(),
			/**
			 * A str (base64 str of a single channel black-and-white img) representing the mask of a segment.
			 */
			mask: z.string(),
			/**
			 * A float that represents how likely it is that the detected object belongs to the given class.
			 */
			score: z.number(),
		})
	),
});

export async function imageSegmentation(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const result = await hf.imageSegmentation(payload, options);
	return { result };
}

export const name = 'imageSegmentation';

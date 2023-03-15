import { z } from 'zod';

import { HfInference } from '@huggingface/inference';

import { optionsSchema } from '../huggingface';
import { APIKeys } from '../../types';

export const inputSchema = z.object({
	model: z.string(),
	/**
	 * Binary image data
	 */
	data: z.instanceof(global.ArrayBuffer ?? Object),
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
			 * A float that represents how likely it is that the image file belongs to this class.
			 */
			score: z.number(),
		})
	),
});

export async function imageClassification(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const result = await hf.imageClassification(payload, options);
	return { result };
}

export const name = 'imageClassification';

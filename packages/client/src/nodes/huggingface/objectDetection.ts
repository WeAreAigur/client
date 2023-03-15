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
			 * A dict (with keys [xmin,ymin,xmax,ymax]) representing the bounding box of a detected object.
			 */
			box: z.object({
				xmax: z.number(),
				xmin: z.number(),
				ymax: z.number(),
				ymin: z.number(),
			}),
			/**
			 * The label for the class (model specific) of a detected object.
			 */
			label: z.string(),
			/**
			 * A float that represents how likely it is that the detected object belongs to the given class.
			 */
			score: z.number(),
		})
	),
});

export async function objectDetection(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const result = await hf.objectDetection(payload, options);
	return { result };
}

export const name = 'objectDetection';

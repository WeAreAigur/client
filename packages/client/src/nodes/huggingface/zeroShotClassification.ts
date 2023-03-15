import { z } from 'zod';

import { HfInference } from '@huggingface/inference';

import { APIKeys } from '../../types';
import { optionsSchema } from './huggingface';

export const inputSchema = z.object({
	model: z.string(),
	/**
	 * a string or list of strings
	 */
	inputs: z.string().or(z.string().array()),
	parameters: z.object({
		/**
		 * a list of strings that are potential classes for inputs. (max 10 candidate_labels, for more, simply run multiple requests, results are going to be misleading if using too many candidate_labels anyway. If you want to keep the exact same, you can simply run multi_label=True and do the scaling on your end.
		 */
		candidate_labels: z.string().array(),
		/**
		 * (Default: false) Boolean that is set to True if classes can overlap
		 */
		multi_label: z.boolean().optional(),
	}),
	options: optionsSchema,
});

export const outputSchema = z.object({
	result: z.array(
		z.object({
			labels: z.string().array(),
			scores: z.number().array(),
			sequence: z.string(),
		})
	),
});

export async function zeroShotClassification(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const result = await hf.zeroShotClassification(payload, options);
	return {
		result,
	};
}

export const name = 'zeroShotClassification';

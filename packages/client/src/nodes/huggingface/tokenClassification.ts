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
			 * (Default: simple). There are several aggregation strategies:
			 *
			 * none: Every token gets classified without further aggregation.
			 *
			 * simple: Entities are grouped according to the default schema (B-, I- tags get merged when the tag is similar).
			 *
			 * first: Same as the simple strategy except words cannot end up with different tags. Words will use the tag of the first token when there is ambiguity.
			 *
			 * average: Same as the simple strategy except words cannot end up with different tags. Scores are averaged across tokens and then the maximum label is applied.
			 *
			 * max: Same as the simple strategy except words cannot end up with different tags. Word entity will be the token with the maximum score.
			 */
			aggregation_strategy: z
				.enum(['none', 'simple', 'first', 'average', 'max'])
				.optional()
				.default('simple'),
		})
		.optional(),
	options: optionsSchema,
});

export const outputSchema = z.object({
	result: z.array(
		z.object({
			/**
			 * The offset stringwise where the answer is located. Useful to disambiguate if word occurs multiple times.
			 */
			end: z.number(),
			/**
			 * The type for the entity being recognized (model specific).
			 */
			entity_group: z.string(),
			/**
			 * How likely the entity was recognized.
			 */
			score: z.number(),
			/**
			 * The offset stringwise where the answer is located. Useful to disambiguate if word occurs multiple times.
			 */
			start: z.number(),
			/**
			 * The string that was captured
			 */
			word: z.string(),
		})
	),
});

/**
 * Usually used for sentence parsing, either grammatical, or Named Entity Recognition (NER) to understand keywords contained within text. Recommended model: dbmdz/bert-large-cased-finetuned-conll03-english
 */
export async function tokenClassification(
	input: z.input<typeof inputSchema>,
	APIKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const { options, ...payload } = inputSchema.parse(input);
	const hf = new HfInference(APIKeys.huggingface);
	const result = await hf.tokenClassification(payload, options);
	return { result };
}

export const name = 'tokenClassification';

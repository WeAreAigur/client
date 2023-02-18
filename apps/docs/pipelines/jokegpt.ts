import { fromZodError } from 'zod-validation-error';
import { z } from 'zod';
import { aigur } from '#/services/aigur';

import { gpt3Prediction, replaceString } from '@aigur/client';

const inputSchema = z.object({
	subject: z.string(),
});

export const jokeGptPipeline = aigur.pipeline.create<{ subject: string }, { joke: string }>({
	id: 'jokegpt',
	validateInput: (input) => {
		try {
			inputSchema.parse(input);
			return { valid: true };
		} catch (err) {
			const validationError = fromZodError(err);

			return { valid: false, error: validationError.message };
		}
	},
	flow: (flow) =>
		flow
			.node(replaceString, ({ input }) => ({
				text: input.subject,
				modifier: 'tell me a joke about $(text)$',
			}))
			.node(gpt3Prediction, ({ prev }) => ({
				prompt: prev.text,
			}))
			.output(({ prev }) => ({
				joke: prev.text,
			})),
});

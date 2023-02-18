import { aigur } from '#/services/aigur';
import { z } from 'zod';

import { gpt3Prediction, replaceString } from '@aigur/client';
import { validateInput } from '@aigur/validate';

const inputSchema = z.object({
	subject: z.string(),
});

export const jokeGptPipeline = aigur.pipeline.create<{ subject: string }, { joke: string }>({
	id: 'jokegpt',
	validateInput: validateInput(inputSchema),
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

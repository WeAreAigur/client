import { z } from 'zod';
import { aigur } from '#/services/aigur';

import { validateInput } from '@aigur/validate';
import { gpt3Prediction, replaceString } from '@aigur/client';

const inputSchema = z.object({
	subject: z.string(),
});

export const jokeGptPipeline = aigur.pipeline.create<z.input<typeof inputSchema>, { joke: string }>(
	{
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
	}
);

import { aigur } from '#/services/aigur';
import { z } from 'zod';

import { gpt3PredictionStream, replaceString } from '@aigur/client';

export const jokeGptPipelineStream = aigur.pipeline.create({
	id: 'jokegptStream',
	stream: true,
	input: z.object({
		subject: z.string(),
	}),
	output: z.instanceof(globalThis.ReadableStream ?? Object),
	flow: (flow) =>
		flow
			.node(replaceString, ({ input }) => ({
				text: input.subject,
				modifier: 'tell me a joke about $(text)$',
			}))
			.node(gpt3PredictionStream, ({ prev }) => ({
				prompt: prev.text,
			}))
			.output(({ prev }) => prev.stream),
});

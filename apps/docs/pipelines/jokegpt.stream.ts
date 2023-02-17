import { z } from 'zod';
import { aigur } from '#/services/aigur';

import { gpt3PredictionStreamNode, simpleModificationNode } from '@aigur/client';

export const jokeGptPipelineStream = aigur.pipeline.create({
	id: 'jokegptStream',
	stream: true,
	input: z.object({
		subject: z.string(),
	}),
	output: z.instanceof(globalThis.ReadableStream ?? Object),
	flow: (flow) =>
		flow
			.node(simpleModificationNode, ({ input }) => ({
				text: input.subject,
				modifier: 'tell me a joke about $(text)$',
			}))
			.node(gpt3PredictionStreamNode, ({ prev }) => ({
				prompt: prev.text,
			}))
			.output(({ prev }) => prev.stream),
});

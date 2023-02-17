import { aigur } from '#/services/aigur';
import { z } from 'zod';

import { gpt3PredictionNode, simpleModificationNode } from '@aigur/client';

export const jokeGptPipeline = aigur.pipeline.create({
	id: 'jokegpt',
	input: z.object({
		subject: z.string(),
	}),
	output: z.object({
		joke: z.string(),
	}),
	flow: (flow) =>
		flow
			.node(simpleModificationNode)(({ input }) => ({
				text: input.subject,
				modifier: 'tell me a joke about $(text)$',
			}))
			.node(gpt3PredictionNode)(({ prev, input, nodes }) => ({
				prompt: prev.text,
			}))
			.output(({ prev }) => ({
				joke: prev.text,
			})),
});

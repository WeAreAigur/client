import { aigur } from '#/services/aigur';
import { z } from 'zod';

import { googleImageLabeling, gpt3PredictionStream, replaceString } from '@aigur/client';

export const imageToPoemStreamPipeline = aigur.pipeline.create({
	id: 'imageToPoemStream',
	stream: true,
	updateProgress: true,
	input: z.object({
		image: z.string(), // base64
	}),
	output: z.instanceof(globalThis.ReadableStream ?? Object),
	flow: (flow) =>
		flow
			.node(googleImageLabeling, ({ input }) => ({
				image: input.image,
			}))
			.node(replaceString, ({ prev }) => ({
				text: prev.labels,
				modifier: 'Write a very short poem about an image with the following entities:\n$(text)$\n',
			}))
			.node(gpt3PredictionStream, ({ prev }) => ({
				prompt: prev.text,
			}))
			.output(({ prev }) => prev.stream),
});

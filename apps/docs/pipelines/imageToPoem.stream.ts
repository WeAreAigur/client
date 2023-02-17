import {
	googleVisionNode,
	gpt3PredictionStreamNode,
	simpleModificationNode,
} from '#/../../packages/client/dist';
import { aigur } from '#/services/aigur';
import { z } from 'zod';

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
			.node(googleVisionNode)(({ input }) => ({
				image: input.image,
			}))
			.node(simpleModificationNode)(({ prev }) => ({
				text: prev.labels,
				modifier: 'Write a very short poem about an image with the following entities:\n$(text)$\n',
			}))
			.node(gpt3PredictionStreamNode)(({ prev }) => ({
				prompt: prev.text,
			}))
			.output(({ prev }) => prev.stream),
});

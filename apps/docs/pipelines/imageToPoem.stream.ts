import { z } from 'zod';
import { aigur } from '#/services/aigur';

export const imageToPoemStreamPipeline = aigur.pipeline.create({
	id: 'imageToPoemStream',
	stream: true,
	updateProgress: true,
	input: z.object({
		image: z.string(), // base64
	}),
	output: z.instanceof(globalThis.ReadableStream ?? Object),
	flow: (flow) =>
		flow.image.labeling
			.google(({ input }) => ({
				image: input.image,
			}))
			.text.modify.simple(({ prev }) => ({
				text: prev.labels,
				modifier: 'Write a very short poem about an image with the following entities:\n$(text)$\n',
			}))
			.text.prediction.gpt3Stream(({ prev }) => ({
				prompt: prev.text,
			}))
			.output(({ prev }) => prev.stream),
});

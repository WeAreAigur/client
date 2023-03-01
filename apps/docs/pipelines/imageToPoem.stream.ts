import { aigur } from '#/services/aigur';

import { googleImageLabeling, gpt3TurboPredictionStream, replaceString } from '@aigur/client';

export const imageToPoemStreamPipeline = aigur.pipeline.create<{ image: string }, ReadableStream>({
	id: 'imageToPoemStream',
	stream: true,
	updateProgress: true,
	flow: (flow) =>
		flow
			.node(googleImageLabeling, ({ input }) => ({
				image: input.image,
			}))
			.node(replaceString, ({ prev }) => ({
				text: prev.labels,
				modifier: 'Write a very short poem about an image with the following entities:\n$(text)$\n',
			}))
			.node(gpt3TurboPredictionStream, ({ prev }) => ({
				messages: [
					{
						role: 'user',
						content: prev.text,
					},
				] as any,
			}))
			.output(({ prev }) => prev.stream),
});

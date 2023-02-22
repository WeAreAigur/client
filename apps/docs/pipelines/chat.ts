import { aigur } from '#/services/aigur';

import { gpt3PredictionStream, replaceString } from '@aigur/client';

import { chatPrompt } from './chatPrompt';

export const chatPipeline = aigur.pipeline.create<
	{ text: string },
	ReadableStream,
	{ previousChat: string }
>({
	id: 'chat',
	stream: true,
	updateProgress: true,
	flow: (flow) =>
		flow
			.node(replaceString, ({ input, memory }) => ({
				text: input.text,
				modifier: `${chatPrompt}\n ${memory.previousChat}\n Human: $(text)$\n Assistant:`,
			}))
			.node(gpt3PredictionStream, ({ prev }) => ({
				prompt: prev.text,
			}))
			.output(({ prev }) => prev.stream),
});

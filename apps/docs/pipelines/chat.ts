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
				modifier: `${memory.previousChat}\n Human: $(text)$\n Assistant:`,
			}))
			.node(replaceString, ({ prev }) => ({
				text: prev.text,
				modifier: `${chatPrompt}\n $(text)$`,
			}))
			.node(gpt3PredictionStream, ({ prev }) => ({
				prompt: prev.text,
			}))
			.output(({ prev }) => prev.stream),
	updateMemory: ({ values, output }) => ({
		previousChat: `${values[0].output.text} ${output}`,
	}),
});

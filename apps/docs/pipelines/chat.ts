import { aigur } from '#/services/aigur';

import { cleanContextVars, gpt3PredictionStream, replaceMultipleStrings } from '@aigur/client';

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
			.node(replaceMultipleStrings, ({ input, memory }) => ({
				strings: {
					text: input.text,
					previousChat: memory.previousChat,
				},
				modifier: `$(previousChat)$\n Human: $(text)$\n Assistant:`,
			}))
			.node(
				cleanContextVars,
				({ prev }) => ({
					text: prev.text,
				}),
				({ output }) => ({
					previousChat: output.text,
				})
			)
			.node(replaceMultipleStrings, ({ prev }) => ({
				strings: {
					text: prev.text,
					chatPrompt,
				},
				modifier: `$(chatPrompt)$\n $(text)$`,
			}))
			.node(gpt3PredictionStream, ({ prev }) => ({
				prompt: prev.text,
			}))
			.output(({ prev }) => prev.stream),
});

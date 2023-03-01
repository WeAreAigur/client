import { aigur } from '#/services/aigur';

import { gpt3TurboStreamPrediction, replaceMultipleStrings } from '@aigur/client';

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
			.node(
				replaceMultipleStrings,
				({ input, memory }) => ({
					strings: {
						text: input.text,
						previousChat: memory.previousChat,
					},
					modifier: `$(previousChat)$\n Human: $(text)$\n Assistant:`,
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
			.node(gpt3TurboStreamPrediction, ({ prev }) => ({
				messages: [
					{
						role: 'user',
						content: prev.text,
					},
				] as any,
			}))
			.output(({ prev }) => prev.stream),
});

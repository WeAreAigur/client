import { aigur } from '#/services/aigur';

import { gpt4PredictionStream, replaceString } from '@aigur/client';

export const jokeGptPipelineStream = aigur.pipeline.create<{ subject: string }, ReadableStream>({
	id: 'jokegptStream',
	stream: true,
	flow: (flow) =>
		flow
			.node(replaceString, ({ input }) => ({
				text: input.subject,
				modifier: 'tell me a joke about $(text)$',
			}))
			.node(gpt4PredictionStream, ({ prev }) => ({
				messages: [
					{
						role: 'user',
						content: prev.text,
					},
				],
			}))
			.output(({ prev }) => prev.stream),
});

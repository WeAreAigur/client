import { z } from 'zod';
import { aigur } from '#/services/aigur';

export const jokeGptPipelineStream = aigur.pipeline.create({
	id: 'jokegptStream',
	stream: true,
	input: z.object({
		subject: z.string(),
	}),
	output: z.instanceof(globalThis.ReadableStream ?? Object),
	flow: (flow) =>
		flow.text.modify
			.simple(({ input }) => ({
				text: input.subject,
				modifier: 'tell me a joke about $(text)$',
			}))
			.text.prediction.gpt3Stream(({ prev }) => ({
				prompt: prev.text,
			}))
			.output(({ prev }) => prev.stream),
});

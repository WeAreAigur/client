import { aigur } from '#/services/aigur';
import { z } from 'zod';

console.log(`***typeof window !== 'undefined'`, typeof window !== 'undefined');
console.log(`***ReadableStream`, typeof ReadableStream !== 'undefined');

export const jokeGptPipelineStream = aigur.pipeline.create({
	id: 'jokegptStream',
	stream: true,
	input: z.object({
		subject: z.string(),
	}),
	output: z.instanceof(ReadableStream),
	flow: (flow) =>
		flow.text.modify
			.simple(({ input }) => ({
				text: input.subject,
				modifier: 'tell me a joke about $(text)$',
			}))
			.text.prediction.gpt3Stream(({ prev }) => ({
				prompt: prev.text,
			}))
			.output(({ prev }) => prev as ReadableStream),
});

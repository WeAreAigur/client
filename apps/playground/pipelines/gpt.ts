import { z } from 'zod';
import { aigur } from '#/services/aigur';

export const gptPipeline = aigur.pipeline.create({
	id: 'gpt',
	input: z.object({
		prompt: z.string(),
	}),
	output: z.object({
		text: z.string(),
	}),
	flow: (flow) =>
		flow.text.prediction.gpt3(({ input }) => ({
			prompt: input.prompt,
		})),
});

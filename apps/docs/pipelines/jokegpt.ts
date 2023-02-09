import { z } from 'zod';
import { aigur } from '#/services/aigur';

export const jokeGptPipeline = aigur.pipeline.create({
	id: 'jokegpt',
	input: z.object({
		subject: z.string(),
	}),
	output: z.object({
		joke: z.string(),
	}),
	flow: (flow) =>
		flow.text.modify
			.simple(({ input }) => ({
				text: input.subject,
				modifier: 'tell me a joke about $(text)$',
			}))
			.text.prediction.gpt3(({ prev }) => ({
				prompt: prev.text,
			}))
			.image.labeling.googleVision(({ prev }) => ({
			image: prev.text
			}))
			.voice.transcribe.whisper(({ prev }) => ({
				audio: prev.
			}
				))
			// .output(({ prev }) => ({
			// 	joke: prev.text,
			// })),
});

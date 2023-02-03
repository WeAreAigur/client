import { z } from 'zod';
import { createClient } from 'lib';

const aigur = createClient({
	apiKeys: {
		openai: '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',
	},
});

const pipeline = aigur.pipeline.create({
	id: 'myPipeline',
	input: {
		prompt: z.string(),
	},
	output: {
		text: z.string(),
	},
	flow: (flow) =>
		flow.text.modify
			.simple((flow) => ({
				text: flow.values.input.prompt,
				modifier: 'tell me a funny joke about: ${text}$',
			}))
			.text.prediction((flow) => ({
				prompt: flow.values.prev.text,
			})),
});

export default pipeline.vercel;

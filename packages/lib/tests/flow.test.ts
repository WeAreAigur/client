import { z } from 'zod';
import { expect, test } from 'vitest';

import { NodeDefinitions } from '../src/nodes';
import { flow } from '../src/flow';
import { createClient } from '../src/Aigur';

test('flow', () => {
	const nodes = flow({
		audio: z.string(),
	})
		.voice.transcribe()
		.text.modify.enhanceWithKeywords((f) => ({ text: f.values[0].text }))
		.text.modify.simple((f) => ({ text: f.values.prev.text, modifier: '${text}, beep boop' }))
		.getNodes();

	expect(nodes).toStrictEqual([
		[NodeDefinitions.Voice.Transcribe, { audio: '$context.input.audio$' }],
		[NodeDefinitions.Text.Modify.EnhanceWithKeywords, { text: '$context.0.text$' }],
		[
			NodeDefinitions.Text.Modify.Simple,
			{ text: '$context.1.text$', modifier: '${text}, beep boop' },
		],
	]);
});

const c = createClient({
	apiKeys: {},
});

const pipeline = c.pipeline.create({
	id: 'myPipeline',
	input: {
		prompt: z.string(),
	},
	output: {
		text: z.string(),
	},
	flow: (flow) =>
		flow.text.modify.simple((flow) => ({
			text: flow.values.input.prompt,
			modifier: '${text}$, beep boop',
		})),
});

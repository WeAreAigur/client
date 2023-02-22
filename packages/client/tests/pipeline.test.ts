import { expect, test } from 'vitest';

import { createClient, replaceString } from '../src/index';

test.only('simple pipeline', async () => {
	const aigur = createClient({ apiKeys: {} });
	const pipeline = aigur.pipeline.create<{ text: string }, { message: string }>({
		id: 'testPipeline',
		flow: (flow) =>
			flow
				.node(replaceString, ({ input }) => ({
					text: input.text,
					modifier: 'Hello $(text)$!',
				}))
				.output(({ prev }) => ({
					message: prev.text,
				})),
	});

	const result = await pipeline.invoke({ text: 'world' });

	expect(result).toStrictEqual({ message: 'Hello world!' });
});

test('multiple nodes', async () => {
	const aigur = createClient({ apiKeys: {} });
	const pipeline = aigur.pipeline.create<{ text: string }, { message: string }>({
		id: 'testPipeline',
		flow: (flow) =>
			flow
				.node(replaceString, ({ input }) => ({
					text: input.text,
					modifier: 'Hello $(text)$!',
				}))
				.node(replaceString, ({ prev }) => ({
					text: prev.text,
					modifier: 'Hello $(text)$!',
				}))
				.node(replaceString, ({ prev }) => ({
					text: prev.text,
					modifier: 'Hello $(text)$!',
				}))
				.node(replaceString, ({ prev }) => ({
					text: prev.text,
					modifier: 'Hello $(text)$!',
				}))
				.output(({ prev }) => ({
					message: prev.text,
				})),
	});

	const result = await pipeline.invoke({ text: 'world' });

	expect(result).toStrictEqual({ message: 'Hello Hello Hello Hello world!!!!' });
});

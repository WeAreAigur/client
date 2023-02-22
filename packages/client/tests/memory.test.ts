import { expect, test } from 'vitest';

import { createClient, replaceString } from '../src/index';

test('use memory', async () => {
	const cache = {};
	const aigur = createClient({
		apiKeys: {},
		memory: {
			loadMemory: async (id) => cache[id],
			saveMemory: async (id, value) => {
				cache[id] = value;
			},
		},
	});
	const pipeline = aigur.pipeline.create<
		{ subject: string },
		{ joke: string },
		{ previousSubject: string }
	>({
		id: 'testPipeline',
		flow: (flow) =>
			flow
				.node(replaceString, ({ input, memory }) => ({
					text: `${input.subject}${
						memory?.previousSubject ? ` and ${memory.previousSubject}` : ''
					}`,
					modifier: 'Tell me a joke about $(text)$',
				}))
				.output(({ prev }) => ({
					joke: prev.text,
				})),
		updateMemory: ({ input }) => ({
			previousSubject: input.subject,
		}),
	});

	let result = await pipeline.invoke({ subject: 'mice' });
	result = await pipeline.invoke({ subject: 'cats' });

	expect(result).toStrictEqual({ joke: 'Tell me a joke about cats and mice' });
});

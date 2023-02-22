import { createRedisMemory } from '@aigur/memory-redis';
import { Aigur, createClient } from '@aigur/client';
import { createAblyNotifier } from '@aigur/ably';

const ably = createAblyNotifier(
	process.env.ABLY_KEY!,
	process.env.NEXT_PUBLIC_ABLY_SUBSCRIBE_KEY!,
	'aigur-client'
);

const cache = {};
const redis = {
	get: async (key) => cache[key],
	set: async (key, value) => (cache[key] = value),
};

export const aigur: Aigur = createClient({
	apiKeys: {
		openai: process.env.OPENAI_KEY!,
		stability: process.env.STABILITY_KEY!,
		googleapis: process.env.GOOGLE_KEY!,
		whisperapi: process.env.WHISPERAPI_KEY!,
	},
	memory: createRedisMemory(redis),
	eventListener: ably.eventListener,
	eventPublisher: ably.eventPublisher,
});

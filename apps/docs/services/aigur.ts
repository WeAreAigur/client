import { Redis } from '@upstash/redis';
import { createRedisMemory } from '@aigur/memory-redis';
import { Aigur, createClient } from '@aigur/client';
import { createAblyNotifier } from '@aigur/ably';

export const redis = typeof window === 'undefined' ? Redis.fromEnv() : null;

const ably = createAblyNotifier(
	process.env.ABLY_KEY!,
	process.env.NEXT_PUBLIC_ABLY_SUBSCRIBE_KEY!,
	'aigur-client'
);

export const aigur: Aigur = createClient({
	apiKeys: {
		openai: process.env.OPENAI_KEY!,
		stability: process.env.STABILITY_KEY!,
		googleapis: process.env.GOOGLE_KEY!,
		whisperapi: process.env.WHISPERAPI_KEY!,
	},
	memoryManager: typeof window === 'undefined' ? createRedisMemory(redis!) : undefined,
	eventListener: ably.eventListener,
	eventPublisher: ably.eventPublisher,
});

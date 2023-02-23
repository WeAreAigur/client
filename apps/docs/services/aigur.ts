import { createAblyNotifier } from '@aigur/ably';
import { Aigur, createClient } from '@aigur/client';
import { createUpstashRedisMemory } from '@aigur/memory-upstash-redis';

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
	memoryManager: createUpstashRedisMemory(),
	eventListener: ably.eventListener,
	eventPublisher: ably.eventPublisher,
});

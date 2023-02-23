import { Redis } from '@upstash/redis';

export function createRedisMemory() {
	try {
		const redis = Redis.fromEnv();

		function saveMemory(id: string, value: Record<string, any>) {
			return redis.hset(id, value);
		}

		async function loadMemory<T extends Record<string, unknown>>(id: string): Promise<T | null> {
			return redis.hgetall<T>(id);
		}
		return {
			saveMemory,
			loadMemory,
		};
	} catch (e) {
		return {
			saveMemory: async (id: string, value: Record<string, any>) => 1,
			loadMemory: async <T>(id: string) => null,
		};
	}
}

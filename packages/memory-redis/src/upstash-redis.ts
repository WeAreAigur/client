import { Redis } from '@upstash/redis';

export function createUpstashRedisMemory() {
	try {
		const redis = Redis.fromEnv();

		function saveMemory(id: string, value: Record<string, any>) {
			redis.hset(id, value);
			return redis.expire(id, 60 * 60);
		}

		function loadMemory<T extends Record<string, unknown>>(id: string): Promise<T | null> {
			return redis.hgetall<T>(id);
		}

		function clearMemory(id: string) {
			return redis.del(id);
		}

		return {
			saveMemory,
			loadMemory,
			clearMemory,
		};
	} catch (e) {
		console.warn(`Could not connect to Upstash Redis Memory: ${e}`);
		return {
			saveMemory: async (id: string, value: Record<string, any>) => 0,
			loadMemory: async <T>(id: string) => null,
			clearMemory: async (id: string) => 0,
		};
	}
}

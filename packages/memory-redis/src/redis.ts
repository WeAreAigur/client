interface Redis {
	get: (key: string) => Promise<string>;
	set: (key: string, value: string) => Promise<void>;
}

export function createRedisMemory(redis: Redis) {
	return {
		saveMemory,
		loadMemory,
	};

	function saveMemory(id: string, value: any) {
		try {
			return redis.set(id, JSON.stringify(value));
		} catch (e) {
			throw new Error('Could not save memory to redis:' + e);
		}
	}

	async function loadMemory(id: string) {
		const item = await redis.get(id);
		try {
			return JSON.parse(item);
		} catch (e) {
			return item;
		}
	}
}

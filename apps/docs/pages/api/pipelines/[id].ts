import { pipelines } from '#/pipelines/pipelines';
import { NextRequest } from 'next/server';

import { vercelEdgeFunction } from '@aigur/client';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req: NextRequest) {
	const { userId } = await req.clone().json();
	const spammers = await redis.lrange('aigur-spammers', 0, -1);
	if (spammers.includes(userId.toLowerCase())) {
		console.log(`blocked spammer ${userId}`);
		return new Response(JSON.stringify({}, null, 2), {
			status: 500,
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
		});
	}
	return vercelEdgeFunction(pipelines)(req);
}

export const config = {
	runtime: 'edge',
};

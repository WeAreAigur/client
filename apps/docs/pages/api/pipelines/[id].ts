import { NextRequest } from 'next/server';
import { pipelines } from '#/pipelines/pipelines';

import { vercelEdgeFunction } from '@aigur/client';

// TODO: migrate to redis
const spammerIds = ['vyt968pycrbfywqo'];

export default async function handler(req: NextRequest) {
	const { userId } = await req.clone().json();
	if (spammerIds.includes(userId)) {
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

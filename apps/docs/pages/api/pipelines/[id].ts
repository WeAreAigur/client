import { NextRequest } from 'next/server';
import { spammerIds } from '#/services/spammers';
import { pipelines } from '#/pipelines/pipelines';

import { vercelEdgeFunction } from '@aigur/client';

export default async function handler(req: NextRequest) {
	const { userId, input } = await req.clone().json();
	console.log(`***userId`, userId, input);
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

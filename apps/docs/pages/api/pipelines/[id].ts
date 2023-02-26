import { NextRequest } from 'next/server';
import { spammerIds } from '#/services/spammers';
import { pipelines } from '#/pipelines/pipelines';

import { vercelEdgeFunction } from '@aigur/client';

export default async function handler(req: NextRequest) {
	const { userId, input } = await req.clone().json();
	console.log(`***spammerIds`, spammerIds);
	console.log(`***userId`, userId, input);
	if (spammerIds.includes(userId)) {
		console.log(`spammer!`);
		return new Response(JSON.stringify({}, null, 2), {
			status: 500,
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
		});
	} else {
		console.log(`not spammer!`);
	}
	return vercelEdgeFunction(pipelines)(req);
}

export const config = {
	runtime: 'edge',
};

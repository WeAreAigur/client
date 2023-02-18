import { NextRequest, NextResponse } from 'next/server';

import { vercelGenericEdge } from '@aigur/client';

export default async function handler(req: NextRequest) {
	const { pipelines } = await import('#/pipelines/pipelines');
	const result = await vercelGenericEdge(pipelines, req);
	if (result instanceof Response) {
		return result;
	}

	if (result.pipeline.conf.stream) {
		return new Response(result.output);
	}
	return NextResponse.json(result.output);
}

export const config = {
	runtime: 'edge',
};

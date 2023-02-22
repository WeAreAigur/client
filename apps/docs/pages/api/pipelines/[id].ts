import { NextRequest, NextResponse } from 'next/server';
import { pipelines } from '#/pipelines/pipelines';

import { vercelGenericEdge } from '@aigur/client';

export default async function handler(req: NextRequest) {
	const result = await vercelGenericEdge(pipelines, req);
	if (result instanceof Response) {
		return result;
	}

	if (result.pipeline.conf.stream && result.output instanceof ReadableStream) {
		return new Response(result.output);
	}
	return NextResponse.json(result.output);
}

export const config = {
	runtime: 'edge',
};

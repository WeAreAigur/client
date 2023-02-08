import { NextRequest, NextResponse } from 'next/server';
import { pipelines } from '#/pipelines/pipelines';

import { vercelGenericEdge } from '@aigur/helpers/vercelGenericEdge';

export default async function handler(req: NextRequest) {
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

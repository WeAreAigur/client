import { NextRequest, NextResponse } from 'next/server';
import { pipelines } from '#/pipelines/pipelines';

import { vercelGenericEdge } from '@aigur/helpers/vercelGenericEdge';

export default async function handler(req: NextRequest) {
	const output = await vercelGenericEdge(pipelines, req);
	return NextResponse.json(output);
}

export const config = {
	runtime: 'edge',
};

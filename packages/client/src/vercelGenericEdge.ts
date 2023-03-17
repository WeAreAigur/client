import type { Pipeline } from './Pipeline';

export async function vercelGenericEdge(
	pipelines: Record<string, Pipeline<any, any, any>>,
	req: any
) {
	const { pipelineInstanceId, userId, input } = await req.json();
	const { searchParams } = new URL(req.url);
	if (!searchParams.has('id')) {
		return new Response('Missing id', { status: 400 });
	}
	const id = searchParams.get('id') as string;
	const pipeline = (pipelines as any)[id];
	const output = await pipeline.invoke(input, { pipelineInstanceId, userId });

	return { output, pipeline };
}

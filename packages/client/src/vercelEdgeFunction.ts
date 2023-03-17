import { Pipeline } from './Pipeline';
import { vercelGenericEdge } from './vercelGenericEdge';

export function vercelEdgeFunction(pipelines: Record<string, Pipeline<any, any, any>>) {
	return async (req: any) => {
		const result = await vercelGenericEdge(pipelines, req);

		if (result instanceof Response) {
			return result;
		}

		if (result.pipeline.conf.stream && result.output instanceof ReadableStream) {
			return new Response(result.output);
		}
		return new Response(JSON.stringify(result.output, null, 2), {
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
		});
	};
}

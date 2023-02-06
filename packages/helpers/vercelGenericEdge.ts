export async function vercelGenericEdge(pipelines, req) {
	const input = await new Response(req.body).json();
	const { searchParams } = new URL(req.url);
	if (!searchParams.has('id')) {
		return new Response('Missing id', { status: 400 });
	}
	const id = searchParams.get('id') as string;
	console.log(`invoking pipeline ${id} with ${JSON.stringify(input, null, 2)}`);
	const output = await (pipelines as any)[id].invoke(input);
	return output;
}

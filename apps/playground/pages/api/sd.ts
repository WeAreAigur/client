import { NextRequest, NextResponse } from 'next/server';
import { sdPipeline } from '#/pipelines/sd';

export default async function handler(req: NextRequest) {
	const input = await new Response(req.body).json();
	const output = await sdPipeline.invoke(input);
	return NextResponse.json(output);
}

export const config = {
	runtime: 'edge',
};

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// 	const input = req.body;
// 	const output = await sdPipeline.invoke(input);
// 	return res.json(output);
// }

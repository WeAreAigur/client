import { z } from 'zod';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseKey, supabaseUrl } from '#/services/supabase';
import { aigur } from '#/services/aigur';

import { supabaseUpload } from '@aigur/helpers/supabase';

const pipeline = aigur.pipeline.create({
	id: 'myPipeline3',
	input: z.object({
		prompt: z.string(),
	}),
	output: z.object({
		url: z.string().url(),
	}),
	flow: (flow) =>
		flow.image.textToImage.stableDiffusion
			.stability(({ input }) => ({
				prompt: input.prompt,
			}))
			.custom(supabaseUpload(supabaseUrl, supabaseKey, 'results'))(({ prev, nodes }) => ({
			file: prev.result,
			extension: 'png',
		})),
});

// export default async function handler(req: NextRequest) {
// 	const input = await new Response(req.body).json();
// 	const output = await pipeline.invoke(input);
// 	return NextResponse.json(output);
// }

// export const config = {
// 	runtime: 'edge',
// };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const input = req.body;
	const output = await pipeline.invoke(input);
	return res.json(output);
}

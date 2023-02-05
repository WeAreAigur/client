import { z } from 'zod';
import { NextApiRequest, NextApiResponse } from 'next';
import { aigur } from '#/services/aigur';

const pipeline = aigur.pipeline.create({
	id: 'myPipeline',
	input: z.object({
		prompt: z.string(),
	}),
	output: z.object({
		url: z.string(),
	}),
	flow: (builder) =>
		builder.text.modify
			.simple(({ input }) => ({
				text: input.prompt,
				modifier: 'tell me a funny joke about: ${text}$',
			}))
			.custom({
				id: 'image.upload',
				schema: {
					input: z.object({
						image: z.string(),
					}),
					output: z.object({
						url: z.string(),
					}),
				},
				action: async (input: { image: string }) => {
					console.log(`uploading image`, input.image);
					return {
						url: 'http://bla',
					};
				},
			})(({ prev, nodes }) => ({
			image: prev.text,
		})),
	// .text.prediction.gpt3(({ prev }) => ({
	// 	prompt: prev.text,
	// }))
	// .image.textToImage.stableDiffusion.stability(({ prev }) => ({
	// 	prompt: prev.text,
	// })),
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

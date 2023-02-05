import { z } from 'zod';
import { NextApiRequest, NextApiResponse } from 'next';
import { aigur } from '#/services/aigur';

const pipeline = aigur.pipeline.create({
	id: 'myPipeline2',
	input: z.object({
		audio: z.string(),
	}),
	output: z.object({
		text: z.string(),
	}),
	flow: (flow) =>
		flow.voice.transcribe.whisper(({ input }) => ({
			audio: input.audio,
		})),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const input = req.body;
	const output = await pipeline.invoke(input);
	return res.json(output);
}

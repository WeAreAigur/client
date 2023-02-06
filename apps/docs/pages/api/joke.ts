import { NextApiRequest, NextApiResponse } from 'next';
import { jokeGptPipeline } from '#/pipelines/jokegpt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const input = req.body;
	const output = await jokeGptPipeline.invoke(input);
	return res.json(output);
}

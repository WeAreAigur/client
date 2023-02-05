import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { aigur } from '#/services/aigur';

const pipeline = aigur.pipeline.create({
	id: 'myPipeline3',
	input: z.object({
		prompt: z.string(),
	}),
	output: z.object({
		text: z.string(),
	}),
	flow: (flow) =>
		flow.text.modify
			.simple(({ input }) => ({
				text: input.prompt,
				modifier: 'tell me a funny joke about: ${text}$',
			}))
			.text.prediction.gpt3(({ prev }) => ({
				prompt: prev.text,
			})),
});

export default async function handler(req: NextRequest) {
	const input = await new Response(req.body).json();
	const output = await pipeline.invoke(input);
	return NextResponse.json(output);
}

export const config = {
	runtime: 'edge',
};

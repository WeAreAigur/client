import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'lib';

const aigur = createClient({
	apiKeys: {
		openai: process.env.OPENAI_KEY!,
	},
});

const pipeline = aigur.pipeline.create({
	id: 'myPipeline',
	input: z.object({
		prompt: z.string(),
	}),
	output: z.object({
		text: z.string(),
	}),
	flow: (flow) =>
		flow.text.modify
			.simple((flow) => ({
				text: flow.values.input.prompt,
				modifier: 'tell me a funny joke about: ${text}$',
			}))
			.text.prediction.gpt3((flow) => ({
				prompt: flow.values.prev.text,
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

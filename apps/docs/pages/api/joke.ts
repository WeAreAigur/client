import { NextRequest, NextResponse } from 'next/server';
import { jokeGptPipeline } from '#/pipelines/jokegpt';

export default async function handler(req: NextRequest) {
	const input = await new Response(req.body).json();
	const output = await jokeGptPipeline.invoke(input);
	return NextResponse.json(output);
}

export const config = {
	runtime: 'edge',
};

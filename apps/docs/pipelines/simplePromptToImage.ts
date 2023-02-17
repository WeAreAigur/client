import { z } from 'zod';
import { aigur } from '#/services/aigur';

import { supabaseUpload } from '@aigur/supabase';
import {
	enhanceWithKeywordsNode,
	gpt3PredictionNode,
	simpleModificationNode,
	stabilityTextToImageNode,
} from '@aigur/client';

export const simplePromptToImagePipeline = aigur.pipeline.create({
	id: 'simplePromptToImage',
	input: z.object({
		prompt: z.string(),
	}),
	output: z.object({
		url: z.string().url(),
		keywords: z.string(),
	}),
	flow: (flow) =>
		flow
			.node(enhanceWithKeywordsNode)(({ input }) => ({
				text: input.prompt,
			}))
			.node(gpt3PredictionNode)(({ prev }) => ({
				prompt: prev.text,
			}))
			.node(simpleModificationNode)(({ prev }) => ({
				text: prev.text,
				modifier: `high resolution photography interior design, interior design magazine, $(text)$, cinematic composition, 8k, highly detailed, cinematography, mega scans, 35mm lens, god rays, pools of light`,
			}))
			.node(stabilityTextToImageNode)(({ prev }) => ({
				text_prompts: [
					{
						text: prev.text,
					},
				],
				clip_guidance_preset: 'SLOW',
				steps: 60,
			}))
			.node(supabaseUpload)(({ prev }) => ({
				bucket: 'results',
				extension: 'png',
				file: prev.result,
				supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
				supabaseUrl: process.env.SUPABASE_URL!,
			}))
			.output(({ prev, nodes }) => ({
				url: prev.url,
				keywords: nodes[2].output.text,
			})),
});

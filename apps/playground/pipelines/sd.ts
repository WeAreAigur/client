import { z } from 'zod';
import { supabaseKey, supabaseUrl } from '#/services/supabase';
import { aigur } from '#/services/aigur';

import { supabaseUpload } from '@aigur/helpers/supabase';

export const sdPipeline = aigur.pipeline.create({
	id: 'sdPipeline',
	input: z.object({
		prompt: z.string(),
	}),
	output: z.object({
		url: z.string().url(),
	}),
	flow: (flow) =>
		flow.image.textToImage.stableDiffusion
			.stability(({ input }) => ({
				text_prompts: [
					{
						text: input.prompt,
					},
				],
			}))
			.custom(supabaseUpload)(({ prev, nodes }) => ({
			file: prev.result,
			bucket: 'results',
			supabaseServiceKey: supabaseKey,
			supabaseUrl: supabaseUrl,
			extension: 'png',
		})),
});

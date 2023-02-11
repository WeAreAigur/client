import { z } from 'zod';
import { aigur } from '#/services/aigur';

import { supabaseUpload } from '@aigur/helpers/supabase';

export const voiceToImagePipeline = aigur.pipeline.create({
	id: 'voiceToImage',
	input: z.object({
		audio: z.string(),
	}),
	output: z.object({
		url: z.string().url(),
		transcription: z.string(),
		keywords: z.string(),
	}),
	flow: (flow) =>
		flow.transformation
			.stringToArrayBuffer(({ input }) => ({
				string: input.audio,
			}))
			.custom(supabaseUpload)(({ prev }) => ({
				bucket: 'audio',
				extension: 'mp3',
				file: prev.arrayBuffer,
				supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
				supabaseUrl: process.env.SUPABASE_URL!,
			}))
			.voice.transcribe.whisper.whisperapi(({ prev }) => ({
				audioUrl: prev.url,
			}))
			.text.modify.enhanceWithKeywords(({ prev }) => ({
				text: prev.text,
			}))
			.text.prediction.gpt3(({ prev }) => ({
				prompt: prev.text,
			}))
			.text.modify.simple(({ prev }) => ({
				text: prev.text,
				modifier: `high resolution photography, magazine, $(text)$, cinematic composition, 8k, highly detailed, cinematography, mega scans, 35mm lens, god rays, pools of light`,
			}))
			.image.textToImage.stableDiffusion.stability(({ prev }) => ({
				text_prompts: [
					{
						text: prev.text,
					},
				],
				clip_guidance_preset: 'SLOW',
				steps: 60,
			}))
			.custom(supabaseUpload)(({ prev }) => ({
				bucket: 'results',
				extension: 'png',
				file: prev.result,
				supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
				supabaseUrl: process.env.SUPABASE_URL!,
			}))
			.output(({ prev, nodes }) => ({
				transcription: nodes[2].output.text,
				keywords: nodes[5].output.text,
				url: prev.url,
			})),
});

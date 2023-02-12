import { z } from 'zod';
import { aigur } from '#/services/aigur';

import { supabaseUpload } from '@aigur/helpers/supabase';

export const summarizeAndReadPipeline = aigur.pipeline.create({
	id: 'summarizeAndRead',
	updateProgress: true,
	input: z.object({
		text: z.string(),
	}),
	output: z.object({
		url: z.string().url(),
		summary: z.string(),
	}),
	flow: (flow) =>
		flow.text.modify
			.simple(({ input }) => ({
				text: input.text,
				modifier: '$(text)$\n\nTl;dr',
			}))
			.text.prediction.gpt3(({ prev }) => ({
				prompt: prev.text,
			}))
			.voice.textToSpeech.google(({ prev }) => ({
				text: prev.text,
			}))
			.transformation.stringToArrayBuffer(({ prev }) => ({
				string: prev.audio,
			}))
			.custom(supabaseUpload)(({ prev }) => ({
				bucket: 'audio',
				extension: 'mp3',
				file: prev.arrayBuffer,
				supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
				supabaseUrl: process.env.SUPABASE_URL!,
			}))
			.output(({ prev, nodes }) => ({
				url: prev.url,
				summary: nodes[1].output.text,
			})),
});

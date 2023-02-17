import { z } from 'zod';
import { aigur } from '#/services/aigur';

import { supabaseUpload } from '@aigur/supabase';
import {
	googleTextToSpeech,
	gpt3Prediction,
	replaceString,
	stringToArrayBuffer,
} from '@aigur/client';

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
		flow
			.node(replaceString, ({ input }) => ({
				text: input.text,
				modifier: '$(text)$\n\nTl;dr',
			}))
			.node(gpt3Prediction, ({ prev }) => ({
				prompt: prev.text,
			}))
			.node(googleTextToSpeech, ({ prev }) => ({
				text: prev.text,
			}))
			.node(stringToArrayBuffer, ({ prev }) => ({
				string: prev.audio,
			}))
			.node(supabaseUpload, ({ prev }) => ({
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

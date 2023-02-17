import {
	googleTextToSpeechNode,
	gpt3PredictionNode,
	simpleModificationNode,
	stringToArrayBufferNode,
} from '#/../../packages/client/dist';
import { aigur } from '#/services/aigur';
import { z } from 'zod';

import { supabaseUpload } from '@aigur/supabase';

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
			.node(simpleModificationNode)(({ input }) => ({
				text: input.text,
				modifier: '$(text)$\n\nTl;dr',
			}))
			.node(gpt3PredictionNode)(({ prev }) => ({
				prompt: prev.text,
			}))
			.node(googleTextToSpeechNode)(({ prev }) => ({
				text: prev.text,
			}))
			.node(stringToArrayBufferNode)(({ prev }) => ({
				string: prev.audio,
			}))
			.node(supabaseUpload)(({ prev }) => ({
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

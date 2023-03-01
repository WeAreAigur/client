import { aigur } from '#/services/aigur';

import { supabaseUpload } from '@aigur/supabase';
import {
    googleTextToSpeech, gpt3TurboPrediction, replaceString, stringToArrayBuffer
} from '@aigur/client';

export const summarizeAndReadPipeline = aigur.pipeline.create<
	{ text: string },
	{ url: string; summary: string }
>({
	id: 'summarizeAndRead',
	updateProgress: true,
	flow: (flow) =>
		flow
			.node(replaceString, ({ input }) => ({
				text: input.text,
				modifier: '$(text)$\n\nTl;dr',
			}))
			.node(gpt3TurboPrediction, ({ prev }) => ({
				messages: [
					{
						role: 'user',
						content: prev.text,
					},
				] as any,
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

import { aigur } from '#/services/aigur';

import { createAblyNotifier } from '@aigur/ably';
import {
	enhanceWithKeywords,
	gpt3Prediction,
	replaceString,
	stabilityTextToImage,
	stringToArrayBuffer,
	whisperApi,
} from '@aigur/client';
import { supabaseUpload } from '@aigur/supabase';

const ably = createAblyNotifier(
	process.env.ABLY_KEY!,
	process.env.NEXT_PUBLIC_ABLY_SUBSCRIBE_KEY!,
	'aigur-client'
);

export const voiceToImagePipeline = aigur.pipeline.create<
	{ audio: string },
	{ url: string; transcription: string; enhancedPrompt: string }
>({
	id: 'voiceToImage',
	updateProgress: true,
	eventListener: ably.eventListener,
	eventPublisher: ably.eventPublisher,
	flow: (flow) =>
		flow
			.node(stringToArrayBuffer, ({ input }) => ({
				string: input.audio,
			}))
			.node(supabaseUpload, ({ prev }) => ({
				bucket: 'audio',
				extension: 'mp3',
				file: prev.arrayBuffer,
				supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
				supabaseUrl: process.env.SUPABASE_URL!,
			}))
			.node(whisperApi, ({ prev }) => ({
				audioUrl: prev.url,
			}))
			.node(enhanceWithKeywords, ({ prev }) => ({
				text: prev.text,
			}))
			.node(gpt3Prediction, ({ prev }) => ({
				prompt: prev.text,
			}))
			.node(replaceString, ({ prev }) => ({
				text: prev.text,
				modifier: `high resolution photography, magazine, $(text)$, cinematic composition, 8k, highly detailed, cinematography, mega scans, 35mm lens, god rays, pools of light`,
			}))
			.node(stabilityTextToImage, ({ prev }) => ({
				text_prompts: [
					{
						text: prev.text,
					},
				],
				steps: 60,
			}))
			.node(supabaseUpload, ({ prev }) => ({
				bucket: 'results',
				extension: 'png',
				file: prev.result,
				supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
				supabaseUrl: process.env.SUPABASE_URL!,
			}))
			.output(({ prev, nodes }) => ({
				transcription: nodes[2].output.text,
				enhancedPrompt: nodes[5].output.text,
				url: prev.url,
			})),
});

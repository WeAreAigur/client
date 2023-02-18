import { z } from 'zod';

import type { APIKeys } from '../../../types';

export const stabilityModel = z.enum([
	'stable-diffusion-v1-5',
	'stable-diffusion-512-v2-0',
	'stable-diffusion-768-v2-0',
	'stable-diffusion-512-v2-1',
	'stable-diffusion-768-v2-1',
]);

export const stabilityClipGuidancePreset = z.enum([
	'NONE',
	'FAST_BLUE',
	'FAST_GREEN',
	'SIMPLE',
	'SLOW',
	'SLOWER',
	'SLOWEST',
]);

const inputSchema = z.object({
	text_prompts: z
		.array(
			z.object({
				text: z.string(),
				weight: z.number().min(-1).max(1).default(1),
			})
		)
		.refine((val) => val.length > 0, 'Must have at least one text prompt'),

	model: stabilityModel.default('stable-diffusion-v1-5'),
	clip_guidance_preset: stabilityClipGuidancePreset.optional(),
	steps: z.number().min(0).max(150).optional(),
	sampler: z
		.enum([
			'DDIM',
			'DDPM',
			'K_DPMPP_2M',
			'K_DPMPP_2S_ANCESTRAL',
			'K_DPM_2',
			'K_DPM_2_ANCESTRAL',
			'K_EULER',
			'K_EULER_ANCESTRAL',
			'K_HEUN',
			'K_LMS',
		])
		.optional(),
	// samples: z.number().optional(),
	cfg_scale: z.number().min(0).max(35).optional(),
	seed: z.number().min(0).optional(),
	height: z
		.number()
		.min(128)
		.optional()
		.refine(
			(val) => (typeof val !== 'undefined' ? val % 64 === 0 : true),
			'Must be a multiple of 64'
		),
	width: z
		.number()
		.min(128)
		.optional()
		.refine(
			(val) => (typeof val !== 'undefined' ? val % 64 === 0 : true),
			'Must be a multiple of 64'
		),
});

const outputSchema = z.object({
	result: z.instanceof(ArrayBuffer),
});

export async function stabilityTextToImage(
	input: z.input<typeof inputSchema>,
	apiKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	console.log(`***input`, input);
	const payload = inputSchema.parse(input);
	console.log(`***payload`, payload);
	const endpoint = `https://api.stability.ai/v1beta/generation/${payload.model}/text-to-image`;
	const response = await fetch(endpoint, {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'image/png',
			Authorization: apiKeys.stability!,
		},
		method: 'POST',
		body: JSON.stringify(payload),
	});

	const image = await response.arrayBuffer();

	return {
		result: image,
	};
}

import { z } from 'zod';
import { APIKeys } from '#/types';

const inputSchema = z.object({
	text_prompts: z
		.array(
			z.object({
				text: z.string(),
				weight: z.number().min(-1).max(1).optional().default(1),
			})
		)
		.refine((val) => val.length > 0, 'Must have at least one text prompt'),
	model: z
		.enum(['stable-diffusion-v1-5', 'stable-diffusion-512-v2-1', 'stable-diffusion-768-v2-1'])
		.optional()
		.default('stable-diffusion-v1-5'),
	clip_guidance_preset: z
		.enum(['NONE', 'FAST_BLUE', 'FAST_GREEN', 'SIMPLE', 'SLOW', 'SLOWER', 'SLOWEST'])
		.optional(),
	steps: z.number().optional(),
	sampler: z.enum(['one', 'two']).optional(),
	samples: z.number().optional(),
	cfg_scale: z.number().optional(),
	seed: z.number().optional(),
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

async function action(
	input: z.input<typeof inputSchema>,
	apiKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
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

export const stabilityTextToImageNode = {
	id: 'image.textToImage.stability',
	schema: {
		input: inputSchema,
		output: outputSchema,
	},
	action,
};

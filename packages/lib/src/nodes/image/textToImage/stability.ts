import { z } from 'zod';

const inputSchema = z.object({
	prompt: z.string(),
	negative_prompt: z.string().optional(),
	// text_prompts: z.array(
	// 	z.object({
	// 		text: z.string(),
	// 		weight: z.number().min(-1).max(1).optional().default(1),
	// 	})
	// ),
	model: z.enum(['stable-diffusion-v1-5']).optional().default('stable-diffusion-v1-5'),
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
	result: z.instanceof(Buffer),
});

async function action(
	input: z.input<typeof inputSchema>,
	apiKeys: Record<string, string>
): Promise<z.infer<typeof outputSchema>> {
	const payload: any = inputSchema.parse(input);
	console.log(`***payload`, payload);
	payload.text_prompts = [
		{
			text: input.prompt,
		},
	];
	delete payload.prompt;
	delete payload.negative_prompt;
	const endpoint = `https://api.stability.ai/v1beta/generation/${payload.model}/text-to-image`;
	const response = await fetch(endpoint, {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'image/png',
			Authorization: apiKeys.stability,
		},
		method: 'POST',
		body: JSON.stringify(payload),
	});

	const image = await response.arrayBuffer();

	return {
		result: Buffer.from(new Uint8Array(image)),
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

import { z } from 'zod';

const inputSchema = z.object({
	prompt: z.string(),
	model: z.enum(['stable-diffusion-v1-5']).optional().default('stable-diffusion-v1-5'),
	samplingSteps: z.number().optional().default(50),
	samplingMethod: z.enum(['one', 'two']).optional(),
	batchSize: z.number().optional().default(1),
	cfgScale: z.number().optional().default(7),
	seed: z.number().optional().default(0),
	height: z.number().optional().default(512),
	width: z.number().optional().default(512),
	negativePrompt: z.string().optional(),
});

const outputSchema = z.object({
	result: z.instanceof(Buffer),
});

async function action(
	input: z.input<typeof inputSchema>,
	apiKeys: Record<string, string>
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	const endpoint = `https://api.stability.ai/v1alpha/generation/${payload.model}/text-to-image`;
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

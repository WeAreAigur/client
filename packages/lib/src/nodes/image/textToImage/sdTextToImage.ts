import { z } from 'zod';

const inputSchema = z.object({
	prompt: z.string(),
});

const outputSchema = z.object({
	result: z.instanceof(ArrayBuffer),
});

async function action(input: z.input<typeof inputSchema>): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	return {
		result: new ArrayBuffer(0),
	};
}

export const sdTextToImageDefinition = {
	id: 'image.textToImage.stableDiffusion',
	schema: {
		input: inputSchema,
		output: outputSchema,
	},
	action,
};

import { z } from 'zod';

const inputSchema = z.object({
	file: z.instanceof(ArrayBuffer).or(z.string()),
});

const outputSchema = z.object({
	text: z.string(),
});

async function action(input: z.input<typeof inputSchema>): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	return {
		text: '',
	};
}

export const uploadDefinition = {
	id: 'results.upload',
	schema: {
		input: inputSchema,
		output: outputSchema,
	},
	action,
};

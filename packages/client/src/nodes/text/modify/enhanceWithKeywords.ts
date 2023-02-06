import { z } from 'zod';

const inputSchema = z.object({
	text: z.string(),
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

export const enhanceWithKeywordsNode = {
	id: 'text.modify.enhanceWithKeywords',
	schema: {
		input: inputSchema,
		output: outputSchema,
	},
	action,
};

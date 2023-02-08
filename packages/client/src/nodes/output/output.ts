import { z } from 'zod';

const inputSchema = z.object({
	text: z.string(),
	modifier: z.string(),
});

const outputSchema = z.object({
	text: z.string(),
});

export const outputNode = <InputOutput>() => ({
	id: 'output',
	schema: {
		input: {} as InputOutput,
		output: {} as InputOutput,
	},
	async action(input: InputOutput): Promise<InputOutput> {
		return input;
	},
});

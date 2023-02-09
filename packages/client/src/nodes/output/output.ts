import { z } from 'zod';

export const outputNode = <InputOutput>() => ({
	id: 'output',
	schema: {
		input: z.object({}) as InputOutput,
		output: z.object({}) as InputOutput,
	},
	async action(input: InputOutput): Promise<InputOutput> {
		return input;
	},
});

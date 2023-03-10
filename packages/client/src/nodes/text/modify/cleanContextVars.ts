import { z } from 'zod';

export const inputSchema = z.object({
	text: z.string(),
});

export const outputSchema = z.object({
	text: z.string(),
});

export async function cleanContextVars(
	input: z.input<typeof inputSchema>
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);

	return {
		text: payload.text.replace(/\$context\..*?\..*?\$/gm, '').trim(),
	};
}

export const name = 'cleanContextVars';

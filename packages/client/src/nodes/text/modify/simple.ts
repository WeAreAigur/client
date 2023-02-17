import { z } from 'zod';

const inputSchema = z.object({
	text: z.string().or(z.array(z.string())),
	modifier: z.string(),
});

const outputSchema = z.object({
	text: z.string(),
});

export async function simpleModificationNode(
	input: z.input<typeof inputSchema>
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	return {
		text: payload.modifier.replace(
			/\$\(text\)\$/gm,
			Array.isArray(payload.text) ? payload.text.join(', ') : payload.text
		),
	};
}

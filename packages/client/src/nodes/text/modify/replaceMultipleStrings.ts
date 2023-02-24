import { z } from 'zod';

const inputSchema = z.object({
	strings: z.record(z.string(), z.string()),
	modifier: z.string(),
});

const outputSchema = z.object({
	text: z.string(),
});

export async function replaceMultipleStrings(
	input: z.input<typeof inputSchema>
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	for (let key in payload.strings) {
		payload.modifier = payload.modifier.replace(
			new RegExp(`\\$\\(${key}\\)\\$`, 'gm'),
			payload.strings[key]
		);
	}

	return {
		text: payload.modifier,
	};
}

// const text = payload.modifier.replace(/\$context\..*?\..*?\$/gm, '').trim();

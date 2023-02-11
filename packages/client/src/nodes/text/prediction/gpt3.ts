import { z } from 'zod';
import { APIKeys } from '#/types';

export const inputSchema = z.object({
	prompt: z.string(),
	model: z.string().default('text-davinci-003'),
	temperature: z.number().default(0.7),
	top_p: z.number().default(1),
	frequency_penalty: z.number().default(0),
	presence_penalty: z.number().default(0),
	max_tokens: z.number().default(200),
	n: z.number().default(1),
});

export const outputSchema = z.object({
	text: z.string(),
});

export async function action(
	input: z.input<typeof inputSchema>,
	apiKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	const response = await fetch('https://api.openai.com/v1/completions', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKeys.openai}`,
		},
		method: 'POST',
		body: JSON.stringify(payload),
	});

	const output = await response.json();
	return { text: output.choices[0]?.text.replace(/^(?:\n)+/gm, '') };
}

export const gpt3PredictionNode = {
	id: 'text.prediction.gpt3',
	schema: {
		input: inputSchema,
		output: outputSchema,
	},
	action,
};

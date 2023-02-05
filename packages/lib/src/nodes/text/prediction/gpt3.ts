import { z } from 'zod';

const inputSchema = z.object({
	prompt: z.string(),
	model: z.string().default('text-davinci-003'),
	temperature: z.number().default(0.7),
	top_p: z.number().default(1),
	frequency_penalty: z.number().default(0),
	presence_penalty: z.number().default(0),
	max_tokens: z.number().default(200),
	n: z.number().default(1),
});

const outputSchema = z.object({
	text: z.string(),
});

async function action(
	input: z.input<typeof inputSchema>,
	apiKeys: Record<string, string>
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

	const output: string = await response.json();
	return { text: output };
}

export const gpt3PredictionDefinition = {
	id: 'text.prediction.gpt3',
	schema: {
		input: inputSchema,
		output: outputSchema,
	},
	action,
};

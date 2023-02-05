import { z } from 'zod';

const inputSchema = z.object({
	audio: z.string(),
});

const outputSchema = z.object({
	text: z.string(),
});

async function action(
	input: z.input<typeof inputSchema>,
	apiKeys: Record<string, string>
): Promise<z.infer<typeof outputSchema>> {
	// const payload = inputType.parse(input);
	// const response = await fetch('https://api.openai.com/v1/completions', {
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		Authorization: `Bearer ${apiKeys.openai}`,
	// 	},
	// 	method: 'POST',
	// 	body: JSON.stringify(payload),
	// });
	// const output: string = await response.json();
	return { text: '' };
}

export const whisperDefintion = {
	id: 'voice.transcribe.whisper',
	schema: {
		input: inputSchema,
		output: outputSchema,
	},
	action,
};

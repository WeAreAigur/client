import { z } from 'zod';
import FormData from 'form-data';
import axios from 'axios';

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
	const payload = inputSchema.parse(input);
	const file = Buffer.from(payload.audio, 'base64');
	const formData = new FormData();
	formData.append('version', '30414ee7c4fffc37e260fcab7842b5be470b9b840f2b608f5baa9bbef9a259ed');
	formData.append('input', { audio: file });
	// formData.append('file', file, { filename: 'audio.mp3' });

	const response = await axios.post(
		'https://api.deepgram.com/v1/listen?model=whisper',
		// 'https://api.replicate.com/v1/predictions',
		// 'https://api.openai.com/v1/engines/audio-transcribe-deprecated/transcriptions',
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${apiKeys.replicate}`,
			},
			body: formData,
		}
	);
	return response.data;
}

export const whisperNode = {
	id: 'voice.transcribe.whisper',
	schema: {
		input: inputSchema,
		output: outputSchema,
	},
	action,
};

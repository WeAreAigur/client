// import { assert, expect, test } from 'vitest';
import z from 'zod';

import { createClient } from '../src/Aigur';

test('test', async () => {
	const aigur = createClient({
		apiKeys: {
			google: 'GOOGLE_API_KEY',
			openai: 'OPENAI_API_KEY',
		},
	});
	// const audio = await aigur.capture.audio();
	// aigur.pipeline.myPipeline.invoke({ audio });

	// creates Vercel edge endpoint
	const pipeline = aigur.pipeline /*.vercel*/
		.create({
			id: 'myPipeline',
			input: {
				audio: z.string().refine(
					(val) => /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(val),
					(val) => ({ message: 'Invalid base64 string' })
				),
			},
			output: {
				image: z.string().url(),
			},
		})
		.flow.voice.transcribe((flow) => ({
			audio: '123',
		}))
		.text.modify.enhanceWithKeywords((flow) => ({ text: '123' }));
	// .text.prediction()
	// .text.modify.simple(input => {
	//   prompt: '${result}, cinematic composition, 8k, photo real, highly detailed',
	// })
	// .image.sd.generate()
	// .result.upload()
	// .done();
});

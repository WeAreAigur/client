import { z } from 'zod';
import { createClient } from 'lib';

console.log(`***z`, z!!);

export const aigur = createClient({
	apiKeys: {
		openai: process.env.OPENAI_KEY!,
		replicate: process.env.REPLICATE_KEY!,
	},
});

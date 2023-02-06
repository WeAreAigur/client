import { z } from 'zod';
import { createClient } from 'lib';

const x = !!z;
export const aigur = createClient({
	apiKeys: {
		openai: process.env.OPENAI_KEY!,
		replicate: process.env.REPLICATE_KEY!,
		stability: process.env.STABILITY_KEY!,
	},
});

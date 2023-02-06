import { createClient } from '@aigur/client';

export const aigur = createClient({
	apiKeys: {
		openai: process.env.OPENAI_KEY!,
		stability: process.env.STABILITY_KEY!,
		googleapis: process.env.GOOGLE_KEY!,
	},
});

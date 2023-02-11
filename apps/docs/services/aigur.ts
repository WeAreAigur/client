import { Aigur, createClient } from '@aigur/client';

export const aigur: Aigur = createClient({
	apiKeys: {
		openai: process.env.OPENAI_KEY!,
		stability: process.env.STABILITY_KEY!,
		googleapis: process.env.GOOGLE_KEY!,
		ablySubscribe: process.env.NEXT_PUBLIC_ABLY_SUBSCRIBE_KEY!,
		ablyPublish: process.env.ABLY_KEY!,
		whisperapi: process.env.WHISPERAPI_KEY!,
	},
});

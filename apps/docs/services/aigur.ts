import { z } from 'zod';

import { createClient } from '@aigur/client';

const x = z;

export const aigur = createClient({
	apiKeys: {
		openai: process.env.OPENAI_KEY!,
		stability: process.env.STABILITY_KEY!,
		googleapis: process.env.GOOGLE_KEY!,
		ably: process.env.NEXT_PUBLIC_ABLY_KEY!,
	},
});

import { z } from 'zod';

import { createClient } from '@aigur/client';

const x = !!z;
export const aigur = createClient({
	apiKeys: {
		openai: process.env.NEXT_PUBLIC_OPENAI_KEY!,
		replicate: process.env.NEXT_PUBLIC_REPLICATE_KEY!,
		stability: process.env.NEXT_PUBLIC_STABILITY_KEY!,
		googleapis: process.env.NEXT_PUBLIC_GOOGLE_KEY!,
	},
});

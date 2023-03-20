import { z } from 'zod';

import { isBase64 } from '../base64';

export const inputSchema = z.object({
	string: z.string().refine(isBase64, { message: 'Must be base64 string' }).describe('base64'),
});

export const outputSchema = z.object({
	arrayBuffer: z.instanceof(ArrayBuffer),
});

export async function stringToArrayBuffer(
	input: z.input<typeof inputSchema>
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	const typedArray = Uint8Array.from(atob(payload.string), (c) => c.charCodeAt(0));

	return {
		arrayBuffer: typedArray.buffer,
	};
}

export const name = 'stringToArrayBuffer';

import { z } from 'zod';

const inputSchema = z.object({
	string: z.string(), // base64
});

const outputSchema = z.object({
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

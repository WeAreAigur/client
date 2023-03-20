import { z } from 'zod';

import { isBase64 } from '../../base64';

import type { APIKeys } from '../../../types';

export const inputSchema = z.object({
	image: z.string().refine(isBase64, { message: 'Must be base64 string' }).describe('base64'),
});

export const outputSchema = z.object({
	labels: z.array(z.string()),
});

export async function googleImageLabeling(
	input: z.input<typeof inputSchema>,
	apiKeys: APIKeys
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKeys.googleapis!}`;
	const request = {
		requests: [
			{
				image: {
					content: payload.image,
				},
				features: [
					{
						type: 'LABEL_DETECTION',
					},
				],
			},
		],
	};
	const response = await fetch(endpoint, {
		method: 'POST',
		body: JSON.stringify(request),
	});

	const data = await response.json();

	return {
		labels: data.responses[0].labelAnnotations.map(
			(label: { description: string }) => label.description
		),
	};
}

export const name = 'googleImageLabeling';

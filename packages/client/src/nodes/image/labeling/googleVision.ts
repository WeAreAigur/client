import { z } from 'zod';

import type { APIKeys } from '../../../types';

const inputSchema = z.object({
	image: z.string(), // base64
});

const outputSchema = z.object({
	labels: z.array(z.string()),
});

async function action(
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
		labels: data.responses[0].labelAnnotations.map((label) => label.description),
	};
}

export const googleVisionNode = {
	id: 'image.labeling.googleVision',
	schema: {
		input: inputSchema,
		output: outputSchema,
	},
	action,
};

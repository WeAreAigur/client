import { z } from 'zod';

const inputSchema = z.object({
	text: z.string(),
	amount: z.number().optional().default(8),
});

const outputSchema = z.object({
	text: z.string(),
});

const examples = {
	'Colonial-style home':
		'Colonial, traditional, classic, historical, timeless, elegant, regal, grand, spacious, architectural, wood-framed, brick-exterior, symmetrical, gabled roof, columns, portico, fireplace, formal, ornate, landscaped'.split(
			', '
		),
	'High-end penthouse apartment':
		'Luxury, high-end, penthouse, apartment, upscale, contemporary, modern, stylish, designer, elite, high-rise, rooftop, panoramic, views, spacious, open-plan, top-floor, amenities, concierge, service, exclusive'.split(
			', '
		),
};

function getExamples(amountOfKeys: number) {
	return Object.entries(examples)
		.map(
			([key, value]) => `Title: ${key}\nDescription: ${value.slice(0, amountOfKeys).join(', ')}\n`
		)
		.join('\n');
}

export async function enhanceWithKeywordsNode(
	input: z.input<typeof inputSchema>
): Promise<z.infer<typeof outputSchema>> {
	const payload = inputSchema.parse(input);
	const enhancedText = `Write a maximum of ${
		payload.amount
	} keywords in a csv list that describes the following\n${getExamples(payload.amount)}\nTitle: ${
		payload.text
	}\nDescription:`;
	return {
		text: enhancedText,
	};
}

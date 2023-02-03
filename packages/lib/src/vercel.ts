import { z } from 'zod';

import { getInputByContext } from './getInputByContext';
import { Builder } from './builder';

export function generateVercelFunction(pipeline: {
	id: string;
	input: z.RecordType<string, any>;
	output: z.RecordType<string, any>;
	flow: Builder<typeof pipeline.input>;
	apiKeys: Record<string, string>;
}) {
	const nodes = pipeline.flow.getNodes();
	return async function handler(req: any, res: any) {
		// validate body against pipeline.input
		let values: any = { input: req.body };
		let lastValue: any = {};

		let i = 0;
		for (let node of nodes) {
			const { id, input, output } = node;

			if (id === 'text.modify.simple') {
				const { text, modifier } = getInputByContext(input, values);

				lastValue = {
					text: modifier.replace(/\$\{text\}\$/gm, text),
				} as typeof output;
				values[i] = lastValue;
			}
			if (id === 'text.prediction') {
				const { prompt } = getInputByContext(input, values);
				const payload = {
					model: 'text-davinci-003',
					prompt,
					temperature: 0.7,
					top_p: 1,
					frequency_penalty: 0,
					presence_penalty: 0,
					max_tokens: 200,
					n: 1,
				};

				const response = await fetch('https://api.openai.com/v1/completions', {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${pipeline.apiKeys.openai}`,
					},
					method: 'POST',
					body: JSON.stringify(payload),
				});

				lastValue = await response.json();
				values[i] = lastValue;
			}
			i++;
		}

		res.status(200).json(lastValue);
	};
}

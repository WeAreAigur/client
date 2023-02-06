import { z } from 'zod';

import { Pipeline } from './types';
import { getInputByContext } from './getInputByContext';

export async function invokePipeline<Input extends z.AnyZodObject, Output extends z.AnyZodObject>(
	pipeline: Pipeline,
	input: z.input<Input>
): Promise<z.output<Output>> {
	try {
		pipeline.input.parse(input);
		const values: any = { input };
		let lastValue: any = {};
		const nodes: any[] = pipeline.flow.getNodes();

		// TODO: handle errors, retries
		// TODO: handle parallel nodes?
		for (let i = 0; i < nodes.length; i++) {
			const { input, schema, action } = nodes[i];

			const value = (await action(
				getInputByContext(input, values),
				pipeline.apiKeys
			)) as typeof schema.output;
			lastValue = value;
			values[i] = value;
		}

		return lastValue;
	} catch (e) {
		console.error(e);
		throw e;
	}
}

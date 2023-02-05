import { Pipeline } from './types';
import { getInputByContext } from './getInputByContext';

export async function invokePipeline(pipeline: Pipeline, input: Record<string, any>) {
	try {
		pipeline.input.parse(input);
		const values: any = { input };
		let lastValue: any = {};
		const nodes = pipeline.flow.getNodes();

		// TODO: handle errors, retries
		// TODO: handle parallel nodes?
		for (let i = 0; i < nodes.length; i++) {
			const {
				id,
				input,
				schema: { output },
				action,
			} = nodes[i];

			const value = (await action(
				getInputByContext(input, values),
				pipeline.apiKeys
			)) as typeof output;
			lastValue = value;
			values[i] = value;
		}

		return lastValue;
	} catch (e) {
		console.error(e);
		throw e;
	}
}

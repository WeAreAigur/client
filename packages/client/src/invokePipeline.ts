import { z } from 'zod';

import { PipelineConf } from './types';
import { notifyProgress } from './notifyProgress';
import { getInputByContext } from './getInputByContext';

const RETRY_DELAY_MS = 350;

export async function invokePipeline<Input extends z.AnyZodObject, Output extends z.AnyZodObject>(
	pipeline: PipelineConf,
	input: z.input<Input>
): Promise<z.output<Output>> {
	try {
		pipeline.input.parse(input);
		const values: any = { input };
		let lastValue: any = {};
		const nodes: any[] = pipeline.flow.getNodes();

		let progressPromise;

		for (let i = 0; i < nodes.length; i++) {
			progressPromise = notifyProgress(pipeline, nodes[i], 'start');
			let attemptCount = 0;
			let isSuccess = false;
			do {
				attemptCount++;
				try {
					lastValue = await executeAction(nodes, i);
					values[i] = lastValue;
					isSuccess = true;
				} catch (e) {
					if (attemptCount > pipeline.retries) {
						throw e;
					}
					await delay(RETRY_DELAY_MS * attemptCount);
				}
			} while (!isSuccess && attemptCount <= pipeline.retries);
			await progressPromise;
			await notifyProgress(pipeline, nodes[i], 'end');
		}

		return lastValue;

		async function executeAction(nodes, index) {
			const { action, schema, input } = nodes[index];
			return action(getInputByContext(input, values), pipeline.apiKeys) as typeof schema.output;
		}
	} catch (e) {
		console.error(e);
		throw e;
	}
}

function delay(time: number) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

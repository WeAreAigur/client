import { z } from 'zod';

import { APIKeys, PipelineConf, ZodReadableStream } from './types';
import { Pipeline } from './Pipeline';
import { Builder } from './builder';

interface AigurConfiguration {
	apiKeys: APIKeys;
}

const DEFAULT_RETRIES = 2;
const RETRY_DELAY_IN_MS = 350;

export type Aigur = {
	pipeline: {
		create: <Input extends z.AnyZodObject, Output extends z.AnyZodObject | ZodReadableStream>(
			conf: PipelineConf<Input, Output>
		) => Pipeline<Input, Output>;
	};
};

export const createClient = (opts: AigurConfiguration): Aigur => {
	const { apiKeys } = opts;
	return {
		pipeline: {
			create: <Input extends z.AnyZodObject, Output extends z.AnyZodObject | ZodReadableStream>(
				conf: PipelineConf<Input, Output>
			) => {
				const pipelineConf: PipelineConf<Input, Output> = {
					...conf,
					retries: conf.retries ?? DEFAULT_RETRIES,
					retryDelayInMs: conf.retryDelayInMs ?? RETRY_DELAY_IN_MS,
				};
				const flow = conf.flow(
					new Builder<typeof conf.input, typeof conf.output, [], null>(conf.input, [])
				);
				console.log(`creating a new pipeline`);
				return new Pipeline(pipelineConf, flow, apiKeys);
			},
		},
	};
};

import { z } from 'zod';

import { Builder } from './builder';
import { Pipeline } from './Pipeline';
import { APIKeys, PipelineConf, ZodReadableStream } from './types';

interface AigurConfiguration {
	apiKeys: APIKeys;
}

const DEFAULT_RETRIES = 2;
const RETRY_DELAY_IN_MS = 350;

export const createClient = (opts: AigurConfiguration) => {
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
				const flow = conf.flow(new Builder(conf.input, []));
				return new Pipeline(pipelineConf, flow, apiKeys);
			},
		},
	};
};

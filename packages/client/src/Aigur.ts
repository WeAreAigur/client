import { APIKeys, FlowBuilder as FlowBuilder2, PipelineConf } from '@aigur/types';

import { Pipeline } from './Pipeline';
import { FlowBuilder } from './builder';

interface AigurConfiguration {
	apiKeys: APIKeys;
}

const DEFAULT_RETRIES = 2;
const RETRY_DELAY_IN_MS = 350;

export type Aigur = ReturnType<typeof createClient>;

export const createClient = (opts: AigurConfiguration) => {
	const { apiKeys } = opts;
	return {
		pipeline: {
			create: <
				Input extends Record<string, unknown>,
				Output extends Record<string, unknown> | ReadableStream
			>(
				conf: PipelineConf<Input, Output>
			) => {
				const pipelineConf: PipelineConf<Input, Output> = {
					...conf,
					retries: conf.retries ?? DEFAULT_RETRIES,
					retryDelayInMs: conf.retryDelayInMs ?? RETRY_DELAY_IN_MS,
				};
				const fb = new FlowBuilder<Input, Output, [], null>([]) as unknown as FlowBuilder2<
					Input,
					Output,
					[],
					null
				>;
				const flow = conf.flow(fb);
				return new Pipeline(pipelineConf, flow, apiKeys);
			},
		},
	};
};

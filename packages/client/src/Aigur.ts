import { FlowBuilder } from './builder';
import { Pipeline } from './Pipeline';
import { AigurConfiguration, PipelineConf } from './types';

const DEFAULT_RETRIES = 2;
const RETRY_DELAY_IN_MS = 350;

export type Aigur = ReturnType<typeof createClient>;

export const createClient = (opts: AigurConfiguration) => {
	const { apiKeys } = opts;
	return {
		apiKeys,
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
					eventListener: opts.eventListener,
					eventPublisher: opts.eventPublisher,
				};
				const flow = conf.flow(new FlowBuilder<Input, Output, [], null>([]));
				return new Pipeline(pipelineConf, flow, apiKeys);
			},
		},
	};
};

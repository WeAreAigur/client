import { AigurConfiguration, PipelineConf } from './types';
import { Pipeline } from './Pipeline';
import { FlowBuilder } from './builder';

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
				Output extends Record<string, unknown> | ReadableStream,
				Memory extends Record<string, unknown> = {}
			>(
				conf: PipelineConf<Input, Output, Memory>
			) => {
				const pipelineConf: PipelineConf<Input, Output, Memory> = {
					...conf,
					retries: conf.retries ?? DEFAULT_RETRIES,
					retryDelayInMs: conf.retryDelayInMs ?? RETRY_DELAY_IN_MS,
					eventListener: opts.eventListener,
					eventPublisher: opts.eventPublisher,
				};
				const flow = conf.flow(new FlowBuilder<Input, Output, [], null>([]));
				return new Pipeline<Input, Output, Memory>(pipelineConf, flow, apiKeys);
			},
		},
	};
};

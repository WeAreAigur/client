import { z } from 'zod';

import { PipelineConf } from './types';
import { invokePipeline } from './invokePipeline';
import { Builder } from './builder';

interface AigurConfiguration {
	apiKeys: Record<string, string> & { openai?: string; stability?: string; googleapis?: string };
}

const DEFAULT_RETRIES = 2;

export const createClient = (opts: AigurConfiguration) => {
	const { apiKeys } = opts;
	return {
		pipeline: {
			create: <Input extends z.AnyZodObject, Output extends z.AnyZodObject>(opts: {
				id: string;
				input: Input;
				output: Output;
				retries?: number;
				flow: (builder: Builder<Input, []>) => Builder<any, any>;
			}) => {
				const flow = opts.flow(new Builder(opts.input, []));
				const pipelineConf: PipelineConf = {
					id: opts.id,
					input: opts.input,
					output: opts.output,
					flow,
					apiKeys,
					retries: opts.retries ?? DEFAULT_RETRIES,
				};
				const pipeline = {
					invoke: (input: z.input<Input>) => invokePipeline<Input, Output>(pipelineConf, input),
					invokeRemote: (endpoint: string, input: z.input<Input>): Promise<z.output<Output>> => {
						return fetch(endpoint, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(input),
						}).then((res) => res.json());
					},
					vercel: {
						invoke: (input: z.input<Input>) => {
							return pipeline.invokeRemote(`/api/pipelines/${opts.id}`, input);
						},
					},
				};

				return pipeline;
			},
		},
	};
};

import { z } from 'zod';

import { Pipeline } from './types';
import { invokePipeline } from './invokePipeline';
import { Builder } from './builder';

interface AigurConfiguration {
	apiKeys: Record<string, string>;
}

export const createClient = (opts: AigurConfiguration) => {
	const { apiKeys } = opts;
	return {
		pipeline: {
			create: <Input extends z.AnyZodObject, Output extends z.AnyZodObject>(opts: {
				id: string;
				input: Input;
				output: Output;
				flow: (builder: Builder<Input, []>) => Builder<any, any>;
			}) => {
				const flow = opts.flow(new Builder(opts.input, []));
				const pipeline: Pipeline = {
					id: opts.id,
					input: opts.input,
					output: opts.output,
					flow,
					apiKeys,
				};
				return {
					invoke: (input: Record<string, any>) => invokePipeline(pipeline, input),
				};
			},
		},
	};
};

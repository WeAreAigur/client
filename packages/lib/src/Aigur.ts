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
			create: (opts: {
				id: string;
				input: z.AnyZodObject;
				output: z.AnyZodObject;
				flow: (
					builder: Builder<z.infer<typeof opts.input>>
				) => Builder<z.infer<typeof opts.output>>;
			}) => {
				const flow = opts.flow(new Builder(opts.input));
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

import { z } from 'zod';

import { Builder } from './builder';

export interface Pipeline {
	id: string;
	input: z.AnyZodObject;
	output: z.AnyZodObject;
	flow: Builder<Record<string, any>>;
	apiKeys: Record<string, string>;
}

export type NodeDefinition<
	T extends { id: string; schema: { input: z.AnyZodObject; output: z.AnyZodObject } }
> = {
	id: string;
	schema: T['schema'];
	input?: T['schema']['input']['shape'];
	action: (
		input: z.output<T['schema']['input']['shape']>,
		apiKeys: Record<string, string>
	) => Promise<z.output<T['schema']['output']['shape']>>;
};

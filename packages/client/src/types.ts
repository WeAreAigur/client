import { z } from 'zod';

import { Builder } from './builder';

export interface PipelineConf {
	id: string;
	input: z.AnyZodObject;
	output: z.AnyZodObject;
	flow: Builder<z.AnyZodObject, []>;
	apiKeys: Record<string, string>;
	retries: number;
	progressListeners: Record<string, (node: ConcreteNode<any, any>, type: ProgressType) => void>;
}

export type NodeDefinition<Input extends z.AnyZodObject, Output extends z.AnyZodObject> = {
	id: string;
	schema: {
		input: Input;
		output: Output;
	};
	action: (input: z.output<Input>, apiKeys: Record<string, string>) => Promise<z.output<Output>>;
};

export type ConcreteNode<
	Input extends z.AnyZodObject,
	Output extends z.AnyZodObject
> = NodeDefinition<Input, Output> & {
	input: z.output<Input>;
	output: z.output<Output>;
};

export type ProgressType = 'start' | 'end' | 'stream';

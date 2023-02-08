import { z } from 'zod';

import { Builder } from './builder';

export interface PipelineConf {
	id: string;
	input: z.AnyZodObject;
	output: z.AnyZodObject | ZodReadableStream;
	flow: Builder<z.AnyZodObject, z.AnyZodObject, []>;
	apiKeys: Record<string, string>;
	retries: number;
	stream: boolean;
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

export type ZodReadableStream = z.ZodType<
	InstanceType<typeof ReadableStream>,
	z.ZodTypeDef,
	InstanceType<typeof ReadableStream>
>;

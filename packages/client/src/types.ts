import { z } from 'zod';

import { Builder } from './builder';

export interface PipelineConf<Input, Output> {
	id: string;
	input: Input;
	output: Output;
	flow: (
		builder: Builder<z.AnyZodObject, z.AnyZodObject | ZodReadableStream, [], null>
	) => Builder<z.AnyZodObject, z.AnyZodObject | ZodReadableStream, any, any>;
	retries?: number;
	stream?: boolean;
	retryDelayInMs?: number;
	updateProgress?: boolean;
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

export type APIKeys = Record<string, string> & {
	openai?: string;
	stability?: string;
	googleapis?: string;
	whisperapi?: string;
};

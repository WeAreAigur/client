import { z } from 'zod';

import { Builder } from './builder';

export interface PipelineConf<
	Input extends z.AnyZodObject,
	Output extends z.AnyZodObject | ZodReadableStream
> {
	id: string;
	input: Input;
	output: Output;
	flow: (
		builder: Builder<Input, Output, [], null>
	) => Builder<Input, Output, any, ConcreteNode<Output, Output>>;
	retries?: number;
	stream?: boolean;
	retryDelayInMs?: number;
	updateProgress?: boolean;
}

export type NodeDefinition<
	Input extends z.AnyZodObject | ZodReadableStream,
	Output extends z.AnyZodObject | ZodReadableStream
> = {
	id: string;
	schema: {
		input: Input;
		output: Output;
	};
	action: (input: z.output<Input>, apiKeys: Record<string, string>) => Promise<z.output<Output>>;
};

export type ConcreteNode<
	Input extends z.AnyZodObject | ZodReadableStream,
	Output extends z.AnyZodObject | ZodReadableStream
> = NodeDefinition<Input, Output> & {
	input: z.output<Input>;
	output: z.output<Output>;
};

export type EventType = PipelineEventType | ProgressEventType;
export type PipelineEventType = 'pipeline:start' | 'pipeline:finish';
export type ProgressEventType = 'node:start' | 'node:finish' | 'node:stream';

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

import { z } from 'zod';

import { FlowBuilder } from './builder';

export interface PipelineConf<
	Input extends z.AnyZodObject,
	Output extends z.AnyZodObject | ZodReadableStream
> {
	id: string;
	input: Input;
	output: Output;
	flow: (
		builder: FlowBuilder<Input, Output, [], null>
	) => FlowBuilder<Input, Output, any, ConcreteNode<z.input<Output>, z.output<Output>>>;
	retries?: number;
	stream?: boolean;
	retryDelayInMs?: number;
	updateProgress?: boolean;
}

// export type NodeDefinition<
// 	Input extends z.AnyZodObject | ZodReadableStream,
// 	Output extends z.AnyZodObject | ZodReadableStream
// > = {
// 	id: string;
// 	schema: {
// 		input: Input;
// 		output: Output;
// 	};
// 	action: (input: z.output<Input>, apiKeys: Record<string, string>) => Promise<z.output<Output>>;
// };

export type NodeAction<
	Input extends Record<string, unknown> | ReadableStream,
	Output extends Record<string, unknown> | ReadableStream
> = (input: Input, apiKeys: Record<string, string>) => Promise<Output>;

export type ConcreteNode<
	Input extends Record<string, unknown> | ReadableStream,
	Output extends Record<string, unknown> | ReadableStream
> = {
	action: NodeAction<Input, Output>;
	input: Input;
	output: Output;
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

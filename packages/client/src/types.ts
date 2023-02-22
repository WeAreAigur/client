import { z } from 'zod';

import { FlowBuilder } from './builder';

export interface AigurConfiguration {
	apiKeys: APIKeys;
	eventListener?: (pipelineInstanceId: string, cb: (event: PipelineEvent) => void) => void;
	eventPublisher?: (pipelineInstanceId: string, event: PipelineEvent) => Promise<any>;
	memoryManager?: MemoryManager<any>;
}

export type PipelineContext<Input, Output, MemoryData> = {
	pipelineInstanceId: string;
	input: Input;
	output: Output extends ReadableStream ? string : Output;
	values: Record<string, NodeContext<any, any>>;
	memory: MemoryData | null;
	userId: string;
};

export interface PipelineConf<
	Input extends Record<string, unknown>,
	Output extends Record<string, unknown> | ReadableStream,
	MemoryData extends Record<string, unknown>
> {
	id: string;
	flow: (
		builder: FlowBuilder<Input, Output, MemoryData, [], null>
	) => FlowBuilder<Input, Output, MemoryData, any, ConcreteNode<Output, Output>>;
	updateMemory?: (pipelineContext: PipelineContext<Input, Output, MemoryData>) => MemoryData;
	memoryManager?: MemoryManager<MemoryData>;
	retries?: number;
	stream?: boolean;
	retryDelayInMs?: number;
	updateProgress?: boolean;
	eventListener?: (pipelineInstanceId: string, cb: (event: PipelineEvent) => void) => void;
	eventPublisher?: (pipelineInstanceId: string, event: PipelineEvent) => Promise<any>;
	validateInput?: (input: Input) => { valid: boolean; message?: string };
}

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
export type NodeContext<
	Input extends Record<string, unknown> | ReadableStream,
	Output extends Record<string, unknown> | ReadableStream
> = {
	input: Input;
	output: Output;
};

export type PipelineEvent = {
	type: EventType;
	data?: Record<any, any>;
	pipelineId: string;
	eventIndex: number;
};

export type PipelineProgressEvent = PipelineEvent & {
	type: ProgressEventType;
};
export type PipelineStatusEvent = PipelineEvent & {
	type: PipelineEventType;
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

export interface MemoryManager<T> {
	saveMemory: (id: string, value: any) => Promise<T | null>;
	loadMemory: (id: string) => Promise<T | null>;
}

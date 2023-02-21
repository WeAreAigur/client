import { z } from 'zod';

import { FlowBuilder } from './builder';

export interface AigurConfiguration {
	apiKeys: APIKeys;
	eventListener?: (pipelineInstanceId: string, cb: (event: PipelineEvent) => void) => void;
	eventPublisher?: (pipelineInstanceId: string, event: PipelineEvent) => Promise<any>;
}

export interface PipelineConf<
	Input extends Record<string, unknown>,
	Output extends Record<string, unknown> | ReadableStream
> {
	id: string;
	flow: (
		builder: FlowBuilder<Input, Output, [], null>
	) => FlowBuilder<Input, Output, any, ConcreteNode<Output, Output>>;
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

export type PipelineEvent = {
	type: EventType;
	data?: Record<any, any>;
	pipelineId: string;
	timestamp: number;
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

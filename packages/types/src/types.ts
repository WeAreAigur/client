export declare type FlowBuilder<
	Input extends Record<string, unknown>,
	Output extends Record<string, unknown> | ReadableStream,
	NodeDefinitions extends ConcreteNode<any, any>[],
	PrevNode extends ConcreteNode<any, any> | null
> = new (nodes: NodeDefinitions) => any;

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

export type EventType = PipelineEventType | ProgressEventType;
export type PipelineEventType = 'pipeline:start' | 'pipeline:finish';
export type ProgressEventType = 'node:start' | 'node:finish' | 'node:stream';

export type APIKeys = Record<string, string> & {
	openai?: string;
	stability?: string;
	googleapis?: string;
	whisperapi?: string;
};

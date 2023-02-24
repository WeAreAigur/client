import { NodeContext, PipelineContext } from './types';

export function createContext<Input, Output, MemoryData>(opts: {
	pipelineInstanceId: string;
	input: Input;
	userId: string;
	memory: MemoryData | null;
}): PipelineContext<Input, Output, MemoryData> {
	// setup pipeline input and memory inside values
	const values = {
		input: { input: opts.input, output: opts.input },
		memory: { input: opts.memory, output: opts.memory },
		pipeline: {
			input: {
				pipelineInstanceId: opts.pipelineInstanceId,
				userId: opts.userId,
			},
			output: {
				pipelineInstanceId: opts.pipelineInstanceId,
				userId: opts.userId,
			},
		},
	} as Record<string, NodeContext<any, any>>;
	return {
		pipelineInstanceId: opts.pipelineInstanceId,
		input: opts.input,
		output: {} as Output extends ReadableStream<any> ? string : Output,
		values,
		memory: opts.memory,
		userId: opts.userId,
	};
}

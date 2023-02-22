import { NodeContext, PipelineContext } from './types';

export function createContext<Input, Output, MemoryData>(opts: {
	pipelineInstanceId: string;
	input: Input;
	userId: string;
	memory?: MemoryData;
}): PipelineContext<Input, Output, MemoryData> {
	// setup pipeline input and memory inside values
	const values = {
		input: { input: opts.input, output: opts.input },
		memory: { input: opts.memory, output: opts.memory },
	} as Record<string, NodeContext<any, any>>;
	return {
		pipelineInstanceId: opts.pipelineInstanceId,
		input: opts.input,
		output: {} as Output,
		values,
		memory: opts.memory,
		userId: opts.userId,
	};
}

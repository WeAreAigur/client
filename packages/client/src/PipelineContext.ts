import { NodeContext, PipelineContext } from './types';

export function createContext<Input, Output, Memory>(opts: {
	pipelineInstanceId: string;
	input: Input;
}): PipelineContext<Input, Output, Memory> {
	const values = { input: opts.input } as Record<string, NodeContext<any, any>>;
	const memory = {} as Memory;
	return {
		pipelineInstanceId: opts.pipelineInstanceId,
		input: opts.input,
		output: {} as Output,
		values,
		memory,
	};
}

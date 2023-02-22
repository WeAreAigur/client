export type PipelineContext<Input> = ReturnType<typeof createContext<Input>>;

export function createContext<Input>(opts: { pipelineInstanceId: string; input: Input }) {
	const values = { input: opts.input };
	return {
		pipelineInstanceId: opts.pipelineInstanceId,
		input: opts.input,
		output: {},
		values,
	};
}

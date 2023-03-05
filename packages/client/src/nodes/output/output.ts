export async function output<PipelineOutput extends Record<string, unknown> | ReadableStream>(
	input: PipelineOutput
): Promise<PipelineOutput> {
	return input;
}

export const name = 'output';

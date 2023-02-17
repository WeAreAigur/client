import { z } from 'zod';
import { ZodReadableStream } from '#/types';

export async function outputNode<PipelineOutput extends z.AnyZodObject | ZodReadableStream>(
	input: z.input<PipelineOutput>
): Promise<z.output<PipelineOutput>> {
	return input;
}

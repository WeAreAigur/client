import { ZodReadableStream } from '#/types';
import { z } from 'zod';

export async function output<PipelineOutput extends z.AnyZodObject | ZodReadableStream>(
	input: z.input<PipelineOutput>
): Promise<z.output<PipelineOutput>> {
	return input;
}

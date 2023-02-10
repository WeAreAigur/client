import { z } from 'zod';

import { jokeGptPipelineStream } from './jokegpt.stream';
import { jokeGptPipeline } from './jokegpt';

const x = z;

export const pipelines = {
	jokegpt: jokeGptPipeline,
	jokegptStream: jokeGptPipelineStream,
} as const;

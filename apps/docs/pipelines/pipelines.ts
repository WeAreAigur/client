import { z } from 'zod';

import { jokeGptPipeline } from './jokegpt';
import { jokeGptPipelineStream } from './jokegpt.stream';

const x = z;

export const pipelines = {
	jokegpt: jokeGptPipeline,
	jokegptStream: jokeGptPipelineStream,
} as const;

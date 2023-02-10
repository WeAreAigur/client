import { z } from 'zod';

import { simplePromptToImagePipeline } from './simplePromptToImage';
import { jokeGptPipelineStream } from './jokegpt.stream';
import { jokeGptPipeline } from './jokegpt';

const x = z;

export const pipelines = {
	jokegpt: jokeGptPipeline,
	jokegptStream: jokeGptPipelineStream,
	simplePromptToImage: simplePromptToImagePipeline,
} as const;

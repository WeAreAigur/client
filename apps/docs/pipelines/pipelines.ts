import { jokeGptPipelineStream } from './jokegpt.stream';
import { jokeGptPipeline } from './jokegpt';

export const pipelines = {
	jokegpt: jokeGptPipeline,
	jokegptStream: jokeGptPipelineStream,
} as const;

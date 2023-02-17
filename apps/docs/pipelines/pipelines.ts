import { z } from 'zod';

import { imageToPoemStreamPipeline } from './imageToPoem.stream';
import { jokeGptPipeline } from './jokegpt';
import { jokeGptPipelineStream } from './jokegpt.stream';
import { simplePromptToImagePipeline } from './simplePromptToImage';
import { summarizeAndReadPipeline } from './summarizeAndRead';
import { voiceToImagePipeline } from './voiceToImage';

const x = z;

export const pipelines = {
	jokegpt: jokeGptPipeline,
	jokegptStream: jokeGptPipelineStream,
	simplePromptToImage: simplePromptToImagePipeline,
	imageToPoemStream: imageToPoemStreamPipeline,
	voiceToImage: voiceToImagePipeline,
	summarizeAndRead: summarizeAndReadPipeline,
} as const;

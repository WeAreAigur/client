import { z } from 'zod';

import { voiceToImagePipeline } from './voiceToImage';
import { summarizeAndReadPipeline } from './summarizeAndRead';
import { jokeGptPipelineStream } from './jokegpt.stream';
import { jokeGptPipeline } from './jokegpt';
import { imageToPoemStreamPipeline } from './imageToPoem.stream';

const x = z;

export const pipelines = {
	jokegpt: jokeGptPipeline,
	jokegptStream: jokeGptPipelineStream,
	imageToPoemStream: imageToPoemStreamPipeline,
	voiceToImage: voiceToImagePipeline,
	summarizeAndRead: summarizeAndReadPipeline,
} as const;

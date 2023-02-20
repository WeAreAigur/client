import { chatPipeline } from './chat';
import { imageToPoemStreamPipeline } from './imageToPoem.stream';
import { jokeGptPipeline } from './jokegpt';
import { jokeGptPipelineStream } from './jokegpt.stream';
import { summarizeAndReadPipeline } from './summarizeAndRead';
import { voiceToImagePipeline } from './voiceToImage';

export const pipelines = {
	jokegpt: jokeGptPipeline,
	jokegptStream: jokeGptPipelineStream,
	imageToPoemStream: imageToPoemStreamPipeline,
	voiceToImage: voiceToImagePipeline,
	summarizeAndRead: summarizeAndReadPipeline,
	chat: chatPipeline,
} as const;

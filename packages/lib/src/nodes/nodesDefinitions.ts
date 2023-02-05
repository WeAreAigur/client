import { whisperNode } from './voice/transcribe/whisper';
import { gpt3PredictionNode } from './text/prediction/gpt3';
import { simpleModificationNode } from './text/modify/simple';
import { enhanceWithKeywordsNode } from './text/modify/enhanceWithKeywords';
import { uploadNode } from './results/upload';
import { stabilityTextToImageNode } from './image/textToImage/stability';

export const nodeDefinitions = {
	text: {
		modify: {
			simple: simpleModificationNode,
			enhanceWithKeywords: enhanceWithKeywordsNode,
		},
		prediction: {
			gpt3: gpt3PredictionNode,
		},
	},
	voice: {
		transcribe: {
			whisper: whisperNode,
		},
	},
	image: {
		textToImage: {
			stableDiffusion: {
				stability: stabilityTextToImageNode,
			},
		},
	},
	results: {
		upload: uploadNode,
	},
} as const;

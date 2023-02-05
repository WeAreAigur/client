import { whisperDefintion } from './voice/transcribe/whisper';
import { gpt3PredictionDefinition } from './text/prediction/gpt3';
import { simpleModificationDefinition } from './text/modify/simple';
import { enhanceWithKeywordsDefinition } from './text/modify/enhanceWithKeywords';
import { uploadDefinition } from './results/upload';
import { sdTextToImageDefinition } from './image/textToImage/sdTextToImage';

export const nodeDefinitions = {
	text: {
		modify: {
			simple: simpleModificationDefinition,
			enhanceWithKeywords: enhanceWithKeywordsDefinition,
		},
		prediction: {
			gpt3: gpt3PredictionDefinition,
		},
	},
	voice: {
		transcribe: {
			whisper: whisperDefintion,
		},
	},
	image: {
		textToImage: {
			stableDiffusion: sdTextToImageDefinition,
		},
	},
	results: {
		upload: uploadDefinition,
	},
} as const;

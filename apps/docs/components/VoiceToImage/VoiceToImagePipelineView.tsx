import { PipelineEditor } from '../Pipeline/PipelineEditor';

import type { Pipeline } from '@aigur/client';
interface VoiceToImagePipelineViewProps {
	isActive: boolean;
	pipeline: Pipeline<any, any>;
}

export function VoiceToImagePipelineView(props: VoiceToImagePipelineViewProps) {
	return (
		<PipelineEditor
			className="h-[750px]"
			pipeline={props.pipeline}
			nodes={[
				{
					id: 'text.transformation.stringToArrayBuffer-0',
					label: 'String to ArrayBuffer',
					definition: {
						type: 'transformation',
					},
				},
				{
					id: 'results.upload.supabase-1',
					label: 'Supabase Upload Audio',
					definition: {
						type: 'custom',
					},
				},
				{
					id: 'voice.transcribe.whisper.whisperapi-2',
					label: 'Whisper',
					definition: {
						type: 'provider',
						label: 'WhisperAPI',
					},
				},
				{
					id: 'text.modify.enhanceWithKeywords-3',
					label: 'Enhance Prompt',
					definition: {
						type: 'transformation',
					},
				},
				{
					id: 'text.prediction.gpt3-4',
					label: 'Generate Keywords',
					definition: {
						type: 'provider',
						label: 'GPT3',
					},
				},
				{
					id: 'text.modify.simple-5',
					label: 'Add Styles',
					definition: {
						type: 'transformation',
					},
				},
				{
					id: 'image.textToImage.stableDiffusion.stability-6',
					label: 'Generate Image',
					definition: {
						type: 'provider',
						label: 'Stability',
					},
				},
				{
					id: 'results.upload.supabase-7',
					label: 'Supabase Upload Image',
					definition: {
						type: 'custom',
					},
				},
				{
					id: 'output-8',
					label: 'Output',
					definition: {
						type: 'output',
					},
				},
			]}
			edges={[
				{
					id: '0-1',
					source: 'text.transformation.stringToArrayBuffer-0',
					target: 'results.upload.supabase-1',
				},
				{
					id: '1-2',
					source: 'results.upload.supabase-1',
					target: 'voice.transcribe.whisper.whisperapi-2',
				},
				{
					id: '2-3',
					source: 'voice.transcribe.whisper.whisperapi-2',
					target: 'text.modify.enhanceWithKeywords-3',
				},
				{
					id: '3-4',
					source: 'text.modify.enhanceWithKeywords-3',
					target: 'text.prediction.gpt3-4',
				},
				{ id: '4-5', source: 'text.prediction.gpt3-4', target: 'text.modify.simple-5' },
				{
					id: '5-6',
					source: 'text.modify.simple-5',
					target: 'image.textToImage.stableDiffusion.stability-6',
				},
				{
					id: '6-7',
					source: 'image.textToImage.stableDiffusion.stability-6',
					target: 'results.upload.supabase-7',
				},
				{ id: '7-8', source: 'results.upload.supabase-7', target: 'output-8' },
			]}
			isActive={props.isActive}
		/>
	);
}

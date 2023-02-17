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
					label: 'String to ArrayBuffer',
					definition: {
						type: 'transformation',
					},
				},
				{
					label: 'Supabase Upload Audio',
					definition: {
						type: 'custom',
					},
				},
				{
					label: 'Whisper',
					definition: {
						type: 'provider',
						label: 'WhisperAPI',
					},
				},
				{
					label: 'Enhance Prompt',
					definition: {
						type: 'transformation',
					},
				},
				{
					label: 'Generate Keywords',
					definition: {
						type: 'provider',
						label: 'GPT3',
					},
				},
				{
					label: 'Add Styles',
					definition: {
						type: 'transformation',
					},
				},
				{
					label: 'Generate Image',
					definition: {
						type: 'provider',
						label: 'Stability',
					},
				},
				{
					label: 'Supabase Upload Image',
					definition: {
						type: 'custom',
					},
				},
				{
					label: 'Output',
					definition: {
						type: 'output',
					},
				},
			]}
			edges={[
				{
					id: '0-1',
					source: '0',
					target: '1',
				},
				{
					id: '1-2',
					source: '1',
					target: '2',
				},
				{
					id: '2-3',
					source: '2',
					target: '3',
				},
				{
					id: '3-4',
					source: '3',
					target: '4',
				},
				{ id: '4-5', source: '4', target: '5' },
				{
					id: '5-6',
					source: '5',
					target: '6',
				},
				{
					id: '6-7',
					source: '6',
					target: '7',
				},
				{ id: '7-8', source: '7', target: '8' },
			]}
			isActive={props.isActive}
		/>
	);
}

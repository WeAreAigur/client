import { PipelineEditor } from '../Pipeline/PipelineEditor';

import type { Pipeline } from '@aigur/client';
interface SummarizeAndReadPipelineViewProps {
	isActive: boolean;
	pipeline: Pipeline<any, any>;
}

export function SummarizeAndReadPipelineView(props: SummarizeAndReadPipelineViewProps) {
	return (
		<PipelineEditor
			className="h-[520px]"
			pipeline={props.pipeline}
			nodes={[
				{
					id: 'text.modify.simple-0',
					label: 'Configure Prompt',
					definition: {
						type: 'transformation',
					},
				},
				{
					id: 'text.prediction.gpt3-1',
					label: 'Summarize',
					definition: {
						type: 'provider',
						label: 'GPT3',
					},
				},
				{
					id: 'voice.textToSpeech.google-2',
					label: 'Text to Speech',
					definition: {
						type: 'provider',
						label: 'Google Text to Speech',
					},
				},
				{
					id: 'text.transformation.stringToArrayBuffer-3',
					label: 'Convert Audio to ArrayBuffer',
					definition: {
						type: 'transformation',
					},
				},
				{
					id: 'supabase.storage.upload-4',
					label: 'Upload Audio to Supabase',
					definition: {
						type: 'custom',
					},
				},
				{
					id: 'output-5',
					label: 'Output',
					definition: {
						type: 'output',
					},
				},
			]}
			edges={[
				{ id: '0-1', source: 'text.modify.simple-0', target: 'text.prediction.gpt3-1' },
				{ id: '1-2', source: 'text.prediction.gpt3-1', target: 'voice.textToSpeech.google-2' },
				{
					id: '2-3',
					source: 'voice.textToSpeech.google-2',
					target: 'text.transformation.stringToArrayBuffer-3',
				},
				{
					id: '3-4',
					source: 'text.transformation.stringToArrayBuffer-3',
					target: 'supabase.storage.upload-4',
				},
				{ id: '4-5', source: 'supabase.storage.upload-4', target: 'output-5' },
			]}
			isActive={props.isActive}
		/>
	);
}

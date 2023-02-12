import { PipelineEditor } from '../Pipeline/PipelineEditor';

import type { Pipeline } from '@aigur/client/src/Pipeline';
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
					id: '0',
					label: 'Configure Prompt',
					definition: {
						type: 'transformation',
					},
				},
				{
					id: '1',
					label: 'Summarize',
					definition: {
						type: 'provider',
						label: 'GPT3',
					},
				},
				{
					id: '2',
					label: 'Text to Speech',
					definition: {
						type: 'provider',
						label: 'Google Text to Speech',
					},
				},
				{
					id: '3',
					label: 'Convert Audio to ArrayBuffer',
					definition: {
						type: 'transformation',
					},
				},
				{
					id: '4',
					label: 'Upload Audio to Supabase',
					definition: {
						type: 'custom',
					},
				},
				{
					id: '5',
					label: 'Output',
					definition: {
						type: 'output',
					},
				},
			]}
			edges={[
				{ id: '0-1', source: '0', target: '1' },
				{ id: '1-2', source: '1', target: '2' },
				{ id: '2-3', source: '2', target: '3' },
				{ id: '3-4', source: '3', target: '4' },
				{ id: '4-5', source: '4', target: '5' },
			]}
			isActive={props.isActive}
		/>
	);
}

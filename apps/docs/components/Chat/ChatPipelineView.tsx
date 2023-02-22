import { PipelineEditor } from '../Pipeline/PipelineEditor';

import type { Pipeline } from '@aigur/client';
interface ChatPipelineViewProps {
	isActive: boolean;
	pipeline: Pipeline<any, any, any>;
}

export function ChatPipelineView(props: ChatPipelineViewProps) {
	return (
		<PipelineEditor
			pipeline={props.pipeline}
			nodes={[
				{
					label: 'Configure Prompt',
					definition: {
						type: 'transformation',
					},
				},
				{
					label: 'Get Chatbot Response',
					definition: {
						type: 'provider',
						label: 'GPT3',
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
				{ id: '0-1', source: '0', target: '1' },
				{ id: '1-2', source: '1', target: '2' },
			]}
			isActive={props.isActive}
		/>
	);
}

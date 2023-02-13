import { PipelineEditor } from '../Pipeline/PipelineEditor';

import type { Pipeline } from '@aigur/client/src/Pipeline';
interface ImageToPoemPipelineViewProps {
	isActive: boolean;
	pipeline: Pipeline<any, any>;
}

export function ImageToPoemPipelineView(props: ImageToPoemPipelineViewProps) {
	return (
		<PipelineEditor
			className="h-[370px]"
			pipeline={props.pipeline}
			nodes={[
				{
					id: 'image.labeling.googleVision-0',
					label: 'Image Labeling',
					definition: {
						type: 'provider',
						label: 'Google Vision',
					},
				},
				{
					id: 'text.modify.simple-1',
					label: 'Create Prompt',
					definition: {
						type: 'transformation',
					},
				},
				{
					id: 'text.prediction.gpt3.stream-2',
					label: 'Generate Poem',
					definition: {
						type: 'provider',
						label: 'GPT3',
					},
				},
				{
					id: 'output-3',
					label: 'Output',
					definition: {
						type: 'output',
					},
				},
			]}
			edges={[
				{ id: '0-1', source: 'image.labeling.googleVision-0', target: 'text.modify.simple-1' },
				{ id: '1-2', source: 'text.modify.simple-1', target: 'text.prediction.gpt3.stream-2' },
				{ id: '2-3', source: 'text.prediction.gpt3.stream-2', target: 'output-3' },
			]}
			isActive={props.isActive}
		/>
	);
}

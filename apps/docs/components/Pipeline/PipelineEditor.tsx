import type { Pipeline } from '@aigur/client';
import ReactFlow, {
	Background,
	BackgroundVariant,
	Edge,
	Panel,
	ReactFlowProvider,
	useEdgesState,
	useNodesState,
} from 'reactflow';

import { convertNodes } from './convertNodes';
import { PipelineNode } from './PipelineNode';

export interface PipelineEditorProps {
	nodes: { label: string; definition: { type: string; label?: string } }[];
	edges: Edge[];
	isActive: boolean;
	zoom?: number;
	isHorizontal?: boolean;
	className?: string;
	pipeline: Pipeline<any, any>;
}

const nodeTypes = {
	pipelineNode: PipelineNode,
};

export function PipelineEditor(props: PipelineEditorProps) {
	const [nodes] = useNodesState(
		convertNodes(props.nodes, props.edges, props.isHorizontal, props.pipeline)
	);
	const [edges] = useEdgesState(props.edges);
	const zoomLevel = props.zoom ?? 0.4;

	return (
		<div className={`flex-1 ${props.className ?? ''}`}>
			<ReactFlowProvider>
				<div className="h-full rounded-lg bg-base-200">
					<ReactFlow
						preventScrolling={false}
						panOnDrag={false}
						maxZoom={zoomLevel}
						minZoom={zoomLevel}
						nodes={nodes}
						edges={edges}
						snapToGrid
						proOptions={{ hideAttribution: true }}
						nodeTypes={nodeTypes}
						fitView
					>
						<Background variant={BackgroundVariant.Dots} />
						<Panel position={'top-left'}>
							<span
								className={`badge ${
									props.isActive ? 'badge-success' : ''
								} transition-all duration-300`}
							>
								Active
							</span>
						</Panel>
					</ReactFlow>
				</div>
			</ReactFlowProvider>
		</div>
	);
}

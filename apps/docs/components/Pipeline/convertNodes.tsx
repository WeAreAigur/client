import type { Pipeline } from '@aigur/client/src/Pipeline';
import { Edge, Node as RFNode, Position } from 'reactflow';

const nodeHeight = 200;
const nodeWidth = 300;

export function convertNodes(
	nodes: any[],
	edges: Edge<any>[],
	isHorizontal: boolean = false,
	inProgressNode: string,
	doneProgressNodes: string[],
	pipeline: Pipeline<any, any>
): RFNode<any>[] {
	const nodeMap: Record<string, any> = {};
	for (let i = 0; i < nodes.length; i++) {
		nodeMap[i.toString()] = nodes[i];
	}

	const convertedNodes: RFNode[] = [];

	let i = 0;
	for (const edge of edges) {
		const sourceNode = nodeMap[edge.source];
		const isInProgress = inProgressNode === sourceNode.id;
		const isDone = doneProgressNodes.includes(sourceNode.id);
		console.log(`node ${edge.source}`, { isInProgress, isDone, id: edge.source });
		convertedNodes.push(
			convertNode(sourceNode, i === 0, false, isHorizontal, isInProgress, isDone, pipeline)
		);
		if (i === edges.length - 1) {
			const targetNode = nodeMap[edge.target];
			convertedNodes.push(
				convertNode(targetNode, false, true, isHorizontal, isInProgress, isDone, pipeline)
			);
		}
		i++;
	}

	return convertedNodes;

	function convertNode(
		node: any,
		isFirst: boolean,
		isLast: boolean,
		isHorizontal: boolean,
		isInProgress: boolean,
		isDone: boolean,
		pipeline: Pipeline<any, any>
	): RFNode<any> {
		return {
			id: node.id.toString(),
			type: 'pipelineNode',
			data: {
				type: node.definition.type,
				label: node.label,
				definitionLabel: node.definition.label,
				handles: [
					...(!isFirst
						? [{ position: isHorizontal ? Position.Left : Position.Top, type: 'target' }]
						: []),
					...(!isLast
						? [{ position: isHorizontal ? Position.Right : Position.Bottom, type: 'source' }]
						: []),
				],
				isInProgress,
				isDone,
				pipeline,
			},
			position: {
				x: isHorizontal ? nodeWidth * (i + (isLast ? 1 : 0)) : 0,
				y: isHorizontal ? 0 : nodeHeight * (i + (isLast ? 1 : 0)),
			},
		};
	}
}

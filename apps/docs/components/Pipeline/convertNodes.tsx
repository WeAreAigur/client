import type { Pipeline } from '@aigur/client';
import { Edge, Node as RFNode, Position } from 'reactflow';

const nodeHeight = 200;
const nodeWidth = 300;

export function convertNodes(
	nodes: any[],
	edges: Edge<any>[],
	isHorizontal: boolean = false,
	pipeline: Pipeline<any, any, any>
): RFNode<any>[] {
	const nodeMap = new Map<string, any>();
	for (let i = 0; i < nodes.length; i++) {
		nodeMap.set(i.toString(), nodes[i]);
	}

	const convertedNodes: RFNode[] = [];

	let i = 0;
	for (const edge of edges) {
		const sourceNode = nodeMap.get(edge.source);
		convertedNodes.push(convertNode(i, sourceNode, i === 0, false, isHorizontal, pipeline));
		if (i === edges.length - 1) {
			const targetNode = nodeMap.get(edge.target);
			convertedNodes.push(convertNode(i + 1, targetNode, false, true, isHorizontal, pipeline));
		}
		i++;
	}

	return convertedNodes;

	function convertNode(
		index: number,
		node: any,
		isFirst: boolean,
		isLast: boolean,
		isHorizontal: boolean,
		pipeline: Pipeline<any, any, any>
	): RFNode<any> {
		return {
			id: index.toString(),
			type: 'pipelineNode',
			data: {
				index,
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
				pipeline,
			},
			position: {
				x: isHorizontal ? nodeWidth * (i + (isLast ? 1 : 0)) : 0,
				y: isHorizontal ? 0 : nodeHeight * (i + (isLast ? 1 : 0)),
			},
		};
	}
}

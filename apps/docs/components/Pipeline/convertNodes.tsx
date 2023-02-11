import { Edge, Node as RFNode, Position } from 'reactflow';

const nodeHeight = 200;
const nodeWidth = 300;

export function convertNodes(
	nodes: any[],
	edges: Edge<any>[],
	isHorizontal: boolean = false
): RFNode<any>[] {
	const nodeMap: Record<string, Node> = {};
	for (const node of nodes) {
		nodeMap[node.id.toString()] = node;
	}

	const convertedNodes: RFNode[] = [];

	let i = 0;
	for (const edge of edges) {
		const sourceNode = nodeMap[edge.source];
		convertedNodes.push(convertNode(sourceNode, i === 0, false, isHorizontal));
		if (i === edges.length - 1) {
			const targetNode = nodeMap[edge.target];
			convertedNodes.push(convertNode(targetNode, false, true, isHorizontal));
		}
		i++;
	}

	return convertedNodes;

	function convertNode(
		node: any,
		isFirst: boolean,
		isLast: boolean,
		isHorizontal: boolean
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
			},
			position: {
				x: isHorizontal ? nodeWidth * (i + (isLast ? 1 : 0)) : 0,
				y: isHorizontal ? 0 : nodeHeight * (i + (isLast ? 1 : 0)),
			},
		};
	}
}

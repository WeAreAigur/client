import { ConcreteNode, NodeAction } from './types';
import { output } from './nodes/output/output';

export class FlowBuilder<
	Input extends Record<string, unknown>,
	Output extends Record<string, unknown> | ReadableStream,
	MemoryData extends Record<string, unknown>,
	NodeDefinitions extends ConcreteNode<any, any>[],
	PrevNode extends ConcreteNode<any, any> | null
> {
	constructor(private nodes: NodeDefinitions) {}

	public node<NodeDef extends NodeAction<any, any>>(
		nodeDefinition: NodeDef,
		getUserInput: (data: {
			nodes: NodeDefinitions;
			prev: PrevNode extends ConcreteNode<any, any>
				? Awaited<ReturnType<PrevNode['action']>>
				: Input;
			input: Input;
			memory: MemoryData;
		}) => Parameters<NodeDef>['0']
	) {
		type NewNode = ConcreteNode<Parameters<NodeDef>['0'], Awaited<ReturnType<NodeDef>>>;
		const memory = this.createDynamicPlaceholders('memory');
		const input = this.createDynamicPlaceholders('input');
		const prev = this.nodes.length > 0 ? this.nodes[this.nodes.length - 1] : input;
		const node = {
			action: nodeDefinition,
			input: getUserInput({
				nodes: this.nodes,
				prev: prev.output,
				input,
				memory,
			}),
			// configure output to return a placeholder for any property accessed (e.g. $context.0.url$)
			output: this.createDynamicPlaceholders(this.nodes.length),
		} as NewNode;

		this.nodes.push(node);
		return this as unknown as FlowBuilder<
			Input,
			Output,
			MemoryData,
			[...NodeDefinitions, NewNode],
			NewNode
		>;
	}

	private createDynamicPlaceholders(source: number | 'input' | 'memory') {
		const output = {};
		const safeNotInstanciatedWarningProxy = {
			get: function (object, prop) {
				return `$context.${source}.${prop}$`;
			},
		};

		const dynamicOutput = new Proxy(output, safeNotInstanciatedWarningProxy);

		return dynamicOutput;
	}

	output(
		getUserInput: (data: {
			nodes: NodeDefinitions;
			prev: PrevNode extends ConcreteNode<any, any>
				? Awaited<ReturnType<PrevNode['action']>>
				: Input;
			input: Input;
		}) => Output
	) {
		return this.node(output<Output>, getUserInput);
	}

	getNodes() {
		return this.nodes;
	}
}

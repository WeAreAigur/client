import { ConcreteNode, NodeAction } from './types';
import { output } from './nodes/output/output';

export class FlowBuilder<
	Input extends Record<string, unknown>,
	Output extends Record<string, unknown> | ReadableStream,
	MemoryData extends Record<string, unknown>,
	NodeDefinitions extends ConcreteNode<any, any, any>[],
	PrevNode extends ConcreteNode<any, any, any> | null
> {
	constructor(private nodes: NodeDefinitions) {}

	public node<NodeDef extends NodeAction<any, any>>(
		nodeDefinition: NodeDef,
		getUserInput: (data: {
			nodes: NodeDefinitions;
			prev: PrevNode extends ConcreteNode<any, any, any>
				? Awaited<ReturnType<PrevNode['action']>>
				: Input;
			input: Input;
			memory: MemoryData;
			userId: string;
		}) => Parameters<NodeDef>['0'],
		getMemory?: (data: {
			nodes: NodeDefinitions;
			prev: PrevNode extends ConcreteNode<any, any, any>
				? Awaited<ReturnType<PrevNode['action']>>
				: Input;
			input: Input;
			output: Awaited<ReturnType<NodeDef>> extends ReadableStream
				? string
				: Awaited<ReturnType<NodeDef>>;
			memory: MemoryData;
			userId: string;
		}) => Partial<MemoryData>
	) {
		type NewNode = ConcreteNode<Parameters<NodeDef>['0'], Awaited<ReturnType<NodeDef>>, MemoryData>;
		// configure to return a placeholder for any property accessed (e.g. $context.0.url$)
		const memory = this.createDynamicPlaceholders('memory');
		const input = this.createDynamicPlaceholders('input');
		// using this.nodes.length and not this.nodes.length - 1 because we want to setup a new node that we didnt add yet to the array
		const output = this.createDynamicPlaceholders(this.nodes.length);
		const prev = this.nodes.length > 0 ? this.nodes[this.nodes.length - 1] : input;
		const userId = '$context.pipeline.userId$';
		const node = {
			action: nodeDefinition,
			input: getUserInput({
				nodes: this.nodes,
				prev: prev.output,
				input,
				memory,
				userId,
			}),
			// configure output to return a placeholder for any property accessed (e.g. $context.0.url$)
			output: this.createDynamicPlaceholders(this.nodes.length),
			memoryToSave: getMemory
				? getMemory({ nodes: this.nodes, prev: prev.output, output, input, memory, userId })
				: null,
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
			prev: PrevNode extends ConcreteNode<any, any, any>
				? Awaited<ReturnType<PrevNode['action']>>
				: Input;
			input: Input;
			memory: MemoryData;
			userId: string;
		}) => Output,
		getMemory?: (data: {
			nodes: NodeDefinitions;
			prev: PrevNode extends ConcreteNode<any, any, any>
				? Awaited<ReturnType<PrevNode['action']>>
				: Input;
			input: Input;
			output: Output extends ReadableStream ? string : Output;
			memory: MemoryData;
			userId: string;
		}) => Partial<MemoryData>
	) {
		return this.node(output<Output>, getUserInput, getMemory);
	}

	getNodes() {
		return this.nodes;
	}
}

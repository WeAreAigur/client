import { z } from 'zod';

import { ConcreteNode, NodeAction, ZodReadableStream } from './types';
import { output } from './nodes/output/output';

export class FlowBuilder<
	Input extends z.ZodObject<any, any, any>,
	Output extends z.ZodObject<any, any, any> | ZodReadableStream,
	NodeDefinitions extends ConcreteNode<any, any>[],
	PrevNode extends ConcreteNode<any, any> | null
> {
	constructor(private input: Input, private nodes: NodeDefinitions) {}

	static create<
		Input extends z.ZodObject<any, any, any>,
		Output extends z.ZodObject<any, any, any> | ZodReadableStream
	>(input: Input) {
		return new FlowBuilder<Input, Output, [], null>(input, []);
	}

	public node<NodeDef extends NodeAction<any, any>>(
		nodeDefinition: NodeDef,
		getUserInput: (data: {
			nodes: NodeDefinitions;
			prev: PrevNode extends ConcreteNode<any, any>
				? Awaited<ReturnType<PrevNode['action']>>
				: Input;
			input: z.output<Input>;
		}) => Parameters<NodeDef>['0']
	) {
		// param 0 is the action input
		// return <NewNode extends ConcreteNode<Parameters<NodeDef>['0'], Awaited<ReturnType<NodeDef>>>>(
		// 	getUserInput: (data: {
		// 		nodes: NodeDefinitions;
		// 		prev: PrevNode extends ConcreteNode<any, any>
		// 			? Awaited<ReturnType<PrevNode['action']>>
		// 			: Input;
		// 		input: z.output<Input>;
		// 	}) => Parameters<NodeDef>['0']
		// ): FlowBuilder<Input, Output, [...NodeDefinitions, NewNode], NewNode> => {

		type NewNode = ConcreteNode<Parameters<NodeDef>['0'], Awaited<ReturnType<NodeDef>>>;
		const input = this.createDynamicPlaceholders('input');
		const prev = this.nodes.length > 0 ? this.nodes[this.nodes.length - 1] : input;
		const node = {
			action: nodeDefinition,
			input: getUserInput({
				nodes: this.nodes,
				prev: prev.output,
				input,
			}),
			// configure output to return a placeholder for any property accessed (e.g. $context.0.url$)
			output: this.createDynamicPlaceholders(this.nodes.length),
		} as NewNode;

		this.nodes.push(node);
		return this as unknown as FlowBuilder<Input, Output, [...NodeDefinitions, NewNode], NewNode>;
	}

	private createDynamicPlaceholders(nodeIndex: number | 'input') {
		const output = {};
		const safeNotInstanciatedWarningProxy = {
			get: function (object, prop) {
				return `$context.${nodeIndex}.${prop}$`;
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
			input: z.output<Input>;
		}) => z.output<Output>
	) {
		return this.node(output<Output>, getUserInput);
	}

	getNodes() {
		return this.nodes;
	}
}

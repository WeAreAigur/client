import { z } from 'zod';

import { ConcreteNode, NodeAction, ZodReadableStream } from './types';
import { outputNode } from './nodes/output/output';

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

	private nodeFactory<NodeDef extends NodeAction<any, any>>(nodeDefinition: NodeDef) {
		// param 0 is the action input
		return <NewNode extends ConcreteNode<Parameters<NodeDef>['0'], Awaited<ReturnType<NodeDef>>>>(
			getUserInput: (data: {
				nodes: NodeDefinitions;
				prev: PrevNode extends ConcreteNode<any, any>
					? Awaited<ReturnType<PrevNode['action']>>
					: Input;
				input: z.output<Input>;
			}) => Parameters<NodeDef>['0']
		): FlowBuilder<Input, Output, [...NodeDefinitions, NewNode], NewNode> => {
			const input = this.createDynamicOutputPlaceholders('input');
			const prev = this.nodes.length > 0 ? this.nodes[this.nodes.length - 1] : input;
			const node = {
				action: nodeDefinition,
				input: getUserInput({
					nodes: this.nodes,
					prev: prev.output,
					input,
				}),
				output: this.createDynamicOutputPlaceholders(this.nodes.length),
			} as ConcreteNode<Parameters<NodeDef>['0'], Awaited<ReturnType<NodeDef>>>;

			this.nodes.push(node);
			return this as unknown as FlowBuilder<Input, Output, [...NodeDefinitions, NewNode], NewNode>;
		};
	}

	private createDynamicOutputPlaceholders(nodeIndex: number | 'input') {
		const output = {};
		const safeNotInstanciatedWarningProxy = {
			get: function (object, prop) {
				return `$context.${nodeIndex}.${prop}$`;
			},
		};

		const dynamicOutput = new Proxy(output, safeNotInstanciatedWarningProxy);

		return dynamicOutput;
	}

	private setPlaceholderValues<T extends ConcreteNode<any, any>>(
		outputKeys: string[],
		index: number | 'input'
	): T['output'] {
		const placeholderedOutput: T['output'] = {};
		for (let key of outputKeys) {
			placeholderedOutput[key] = `$context.${index}.${key}$`;
		}
		return placeholderedOutput;
	}

	node<
		I extends Record<string, any> | ReadableStream,
		O extends Record<string, any> | ReadableStream
	>(node: NodeAction<I, O>) {
		return this.nodeFactory(node);
	}

	output = this.nodeFactory(outputNode<Output>);

	getNodes() {
		return this.nodes;
	}
}

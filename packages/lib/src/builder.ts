import { z } from 'zod';

import { ConcreteNode, NodeDefinition } from './types';
import { nodeDefinitions } from './nodes/nodesDefinitions';

export class Builder<
	Input extends z.ZodObject<any, any, any>,
	NodeDefinitions extends ConcreteNode<any, any>[]
> {
	constructor(private input: Input, private nodes: NodeDefinitions) {}

	static create<Input extends z.ZodObject<any, any, any>>(input: Input) {
		return new Builder<Input, []>(input, []);
	}

	private nodeFactory<NodeDef extends NodeDefinition<any, any>>(nodeDefinition: NodeDef) {
		return <NextNode extends ConcreteNode<NodeDef['schema']['input'], NodeDef['schema']['output']>>(
			getUserInput: (data: {
				nodes: NodeDefinitions;
				prev: NodeDefinitions[-1]['output'];
				input: z.output<Input>;
			}) => z.input<NextNode['schema']['input']>
		): Builder<Input, [...NodeDefinitions, NextNode]> => {
			const input = this.setPlaceholderValues(this.input.keyof().options, 'input');
			const prev = this.nodes.length > 0 ? this.nodes[this.nodes.length - 1] : input;
			const node = {
				...nodeDefinition,
				input: getUserInput({
					nodes: this.nodes,
					prev: prev.output,
					input,
				}),
				output: this.setPlaceholderValues<NextNode>(
					nodeDefinition.schema.output.keyof().options,
					this.nodes.length
				),
			} as ConcreteNode<NodeDef['schema']['input'], NodeDef['schema']['output']>;

			this.nodes.push(node);
			return this as any;
		};
	}

	private setPlaceholderValues<T extends ConcreteNode<any, any>>(
		outputKeys: string[],
		index: number | 'input'
	): T['output'] {
		const placeholderedOutput: T['output'] = {};
		for (let key of outputKeys) {
			// using nodes.length and not nodes.length - 1 because we haven't pushed the node yet
			placeholderedOutput[key] = `$context.${index}.${key}$`;
		}
		return placeholderedOutput;
	}

	custom<Input extends z.AnyZodObject, Output extends z.AnyZodObject>(
		node: NodeDefinition<Input, Output>
	) {
		return this.nodeFactory(node);
	}

	voice = {
		transcribe: {
			whisper: this.nodeFactory(nodeDefinitions.voice.transcribe.whisper),
		},
	};

	text = {
		modify: {
			enhanceWithKeywords: this.nodeFactory(nodeDefinitions.text.modify.enhanceWithKeywords),
			simple: this.nodeFactory(nodeDefinitions.text.modify.simple),
		},
		prediction: {
			gpt3: this.nodeFactory(nodeDefinitions.text.prediction.gpt3),
		},
	};

	image = {
		textToImage: {
			stableDiffusion: {
				stability: this.nodeFactory(nodeDefinitions.image.textToImage.stableDiffusion.stability),
			},
		},
	};

	results = {
		upload: this.nodeFactory(nodeDefinitions.results.upload),
	};

	getNodes() {
		return this.nodes;
	}
}

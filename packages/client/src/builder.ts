import { z } from 'zod';

import { ConcreteNode, NodeDefinition, ZodReadableStream } from './types';
import { gpt3PredictionStreamNode } from './nodes/text/prediction/gpt3.stream';
import { outputNode } from './nodes/output/output';
import {
    enhanceWithKeywordsNode, googleTextToSpeechNode, googleVisionNode, gpt3PredictionNode,
    simpleModificationNode, stabilityTextToImageNode, stringToArrayBufferNode, whisperApiNode
} from './nodes/nodesDefinitions';

export class Builder<
	Input extends z.ZodObject<any, any, any>,
	Output extends z.ZodObject<any, any, any> | ZodReadableStream,
	NodeDefinitions extends ConcreteNode<any, any>[],
	PrevNode extends ConcreteNode<any, any> | null
> {
	constructor(private input: Input, private nodes: NodeDefinitions) {}

	static create<
		Input extends z.ZodObject<any, any, any>,
		Output extends z.ZodObject<any, any, any>
	>(input: Input) {
		return new Builder<Input, Output, [], null>(input, []);
	}

	private nodeFactory<NodeDef extends NodeDefinition<any, any>>(nodeDefinition: NodeDef) {
		return <NextNode extends ConcreteNode<NodeDef['schema']['input'], NodeDef['schema']['output']>>(
			getUserInput: (data: {
				nodes: NodeDefinitions;
				prev: PrevNode extends ConcreteNode<any, any> ? PrevNode['output'] : Input;
				input: z.output<Input>;
			}) => z.input<NextNode['schema']['input']>
		): Builder<Input, Output, [...NodeDefinitions, NextNode], NextNode> => {
			const input = this.setPlaceholderValues(this.input.keyof().options, 'input');
			const prev = this.nodes.length > 0 ? this.nodes[this.nodes.length - 1] : input;
			const node = {
				...nodeDefinition,
				input: getUserInput({
					nodes: this.nodes,
					prev: prev.output,
					input,
				}),
				output: nodeDefinition.schema.output.keyof
					? this.setPlaceholderValues<NextNode>(
							nodeDefinition.schema.output.keyof().options,
							this.nodes.length
					  )
					: nodeDefinition.schema.output,
			} as ConcreteNode<NodeDef['schema']['input'], NodeDef['schema']['output']>;

			this.nodes.push(node);
			return this as unknown as Builder<Input, Output, [...NodeDefinitions, NextNode], NextNode>;
		};
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

	custom<Input extends z.AnyZodObject, Output extends z.AnyZodObject>(
		node: NodeDefinition<Input, Output>
	) {
		return this.nodeFactory(node);
	}

	voice = {
		textToSpeech: {
			google: this.nodeFactory(googleTextToSpeechNode),
		},
		transcribe: {
			whisper: {
				whisperapi: this.nodeFactory(whisperApiNode),
			},
		},
	};

	text = {
		modify: {
			enhanceWithKeywords: this.nodeFactory(enhanceWithKeywordsNode),
			simple: this.nodeFactory(simpleModificationNode),
		},
		prediction: {
			gpt3: this.nodeFactory(gpt3PredictionNode),
			gpt3Stream: this.nodeFactory(gpt3PredictionStreamNode),
		},
	};

	image = {
		textToImage: {
			stableDiffusion: {
				stability: this.nodeFactory(stabilityTextToImageNode),
			},
		},
		labeling: {
			googleVision: this.nodeFactory(googleVisionNode),
		},
	};

	output = this.nodeFactory(outputNode<Output>());

	transformation = {
		stringToArrayBuffer: this.nodeFactory(stringToArrayBufferNode),
	};

	getNodes() {
		return this.nodes;
	}
}

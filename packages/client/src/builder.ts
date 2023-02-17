import { z } from 'zod';

import { outputNode } from './nodes/output/output';
import { ConcreteNode, NodeAction, ZodReadableStream } from './types';

export class Builder<
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
		return new Builder<Input, Output, [], null>(input, []);
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
		): Builder<Input, Output, [...NodeDefinitions, NewNode], NewNode> => {
			const input = createDynamicOutputPlaceholders('input');
			const prev = this.nodes.length > 0 ? this.nodes[this.nodes.length - 1] : input;
			const node = {
				action: nodeDefinition,
				input: getUserInput({
					nodes: this.nodes,
					prev: prev.output,
					input,
				}),
				output: createDynamicOutputPlaceholders(this.nodes.length),
			} as ConcreteNode<Parameters<NodeDef>['0'], Awaited<ReturnType<NodeDef>>>;

			this.nodes.push(node);
			return this as unknown as Builder<Input, Output, [...NodeDefinitions, NewNode], NewNode>;

			function createDynamicOutputPlaceholders(nodeIndex: number | 'input') {
				const output = {};
				const safeNotInstanciatedWarningProxy = {
					get: function (object, prop) {
						return `$context.${nodeIndex}.${prop}$`;
					},
				};

				const dynamicOutput = new Proxy(output, safeNotInstanciatedWarningProxy);

				return dynamicOutput;
			}
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

	node<I extends z.AnyZodObject, O extends z.AnyZodObject | ZodReadableStream>(
		node: NodeAction<I, O>
	) {
		return this.nodeFactory(node);
	}

	// voice = {
	// 	textToSpeech: {
	// 		google: this.nodeFactory(googleTextToSpeechNode),
	// 	},
	// 	transcribe: {
	// 		whisper: {
	// 			whisperapi: this.nodeFactory(whisperApiNode),
	// 		},
	// 	},
	// };

	// text = {
	// 	modify: {
	// 		enhanceWithKeywords: this.nodeFactory(enhanceWithKeywordsNode),
	// 		simple: this.nodeFactory(simpleModificationNode),
	// 	},
	// 	prediction: {
	// 		gpt3: this.nodeFactory(gpt3PredictionNode),
	// 		gpt3Stream: this.nodeFactory(gpt3PredictionStreamNode),
	// 	},
	// };

	// image = {
	// 	textToImage: {
	// 		stableDiffusion: {
	// 			stability: this.nodeFactory(stabilityTextToImageNode),
	// 		},
	// 	},
	// 	labeling: {
	// 		google: this.nodeFactory(googleVisionNode),
	// 	},
	// };

	output = this.nodeFactory(outputNode<Output>);

	// transformation = {
	// 	stringToArrayBuffer: this.nodeFactory(stringToArrayBufferNode),
	// };

	getNodes() {
		return this.nodes;
	}
}

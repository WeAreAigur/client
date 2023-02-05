import { z } from 'zod';

import { NodeDefinition } from './types';
import { nodeDefinitions } from './nodes/nodesDefinitions';

function placeholder(output, index) {
	let placeholders: Record<string, string> = {};
	const keys = output.keyof()._def.values;
	console.log(`***keys`, keys);
	for (let key of keys) {
		placeholders[key] = `$context.${index}.${key}$`;
	}
	console.log(`***placeholders`, placeholders);
	return placeholders;
}

export class Builder<T> {
	constructor(private initialInput: z.AnyZodObject, private nodes: NodeDefinition<any>[] = []) {}

	values = {
		...this.nodes.map((node, index) => ({
			[index]: placeholder(node.schema.output, index),
		}))[0],
		prev:
			this.nodes.length > 0
				? (placeholder(this.nodes.slice(-1)[0].schema.output, this.nodes.length - 1) as T)
				: ({} as T),
		input: placeholder(this.initialInput, 'input'),
	} as Record<number, string> & { prev: Record<keyof T, string> } & {
		input: Record<string, string>;
	};

	private getConfNodeIndex(nodes) {
		if (nodes.length === 0) {
			return 'input';
		}
		return nodes.length - 1;
	}

	private getConfiguration<T>(nodes, nodeInputSchema, getUserInput): T {
		const conf: T = getUserInput ? getUserInput(this) : {};
		for (let key in nodeInputSchema) {
			if (nodeInputSchema[key] === '') {
				conf[key] = `$context.${this.getConfNodeIndex(nodes)}.${key}$`;
			}
		}
		return conf;
		// later - validate conf by nodeInputSchema
	}

	nodeFactory<
		T extends { id: string; action: any; schema: { input: z.AnyZodObject; output: z.AnyZodObject } }
	>(nodeDefinition: NodeDefinition<T>) {
		return (getUserInput?: (flow: this) => z.infer<typeof nodeDefinition.schema.input>) => {
			console.log(`getting configuration for ${nodeDefinition.id}`);
			const input = this.getConfiguration<z.infer<typeof nodeDefinition.schema.input>>(
				this.nodes,
				nodeDefinition.schema.input,
				getUserInput
			);
			this.nodes.push({ ...nodeDefinition, input } as NodeDefinition<T>);
			return new Builder<z.infer<typeof nodeDefinition.schema.output>>(
				this.initialInput,
				this.nodes
			);
		};
	}

	voice = {
		transcribe: {
			whisper: this.nodeFactory<typeof nodeDefinitions.voice.transcribe.whisper>(
				nodeDefinitions.voice.transcribe.whisper
			),
		},
	};

	text = {
		modify: {
			enhanceWithKeywords: this.nodeFactory<typeof nodeDefinitions.text.modify.enhanceWithKeywords>(
				nodeDefinitions.text.modify.enhanceWithKeywords
			),
			simple: this.nodeFactory<typeof nodeDefinitions.text.modify.simple>(
				nodeDefinitions.text.modify.simple
			),
		},
		prediction: {
			gpt3: this.nodeFactory<typeof nodeDefinitions.text.prediction.gpt3>(
				nodeDefinitions.text.prediction.gpt3
			),
		},
	};

	image = {
		textToImage: {
			stableDiffusion: this.nodeFactory<typeof nodeDefinitions.image.textToImage.stableDiffusion>(
				nodeDefinitions.image.textToImage.stableDiffusion
			),
		},
	};

	results = {
		upload: this.nodeFactory<typeof nodeDefinitions.results.upload>(nodeDefinitions.results.upload),
	};

	getNodes() {
		return this.nodes;
	}
}

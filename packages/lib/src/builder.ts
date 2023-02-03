import { AigurNode } from './types';
import { NodeDefinitions } from './nodes';

function placeholder(output, index) {
	return Object.keys(output).map((k) => ({
		[k]: `$context.${index}.${k}$`,
	}))[0];
}

export class Builder<T> {
	constructor(private initialInput: Record<string, any>, private nodes: AigurNode[] = []) {}

	values = {
		...this.nodes.map((node, index) => ({
			[index]: placeholder(node.output, index),
		}))[0],
		prev:
			this.nodes.length > 0
				? placeholder(this.nodes.slice(-1)[0].output, this.nodes.length - 1)
				: {},
		input: placeholder(this.initialInput, 'input'),
	};

	private getConfNodeIndex(nodes) {
		if (nodes.length === 0) {
			return 'input';
		}
		return nodes.length - 1;
	}

	private getConfiguration(nodes, nodeInput, userInputFn): Record<string, any> {
		const userInput = userInputFn ? userInputFn(this) : null;
		if (userInput) {
			return userInput;
		}

		const conf = userInputFn ? userInputFn() : {};
		for (let key in nodeInput) {
			if (nodeInput[key] === '') {
				conf[key] = `$context.${this.getConfNodeIndex(nodes)}.${key}$`;
			}
		}
		return conf;
		// later - validate input by nodeInput
	}

	voice = {
		transcribe: (conf?: (flow: this) => typeof NodeDefinitions.Voice.Transcribe.input) => {
			const input = this.getConfiguration(this.nodes, NodeDefinitions.Voice.Transcribe.input, conf);
			this.nodes.push({ ...NodeDefinitions.Voice.Transcribe, input });
			return new Builder<typeof NodeDefinitions.Voice.Transcribe.output>(
				this.initialInput,
				this.nodes
			);
		},
	};

	text = {
		modify: {
			enhanceWithKeywords: (
				conf?: (flow: this) => typeof NodeDefinitions.Text.Modify.EnhanceWithKeywords.input
			) => {
				const input = this.getConfiguration(
					this.nodes,
					NodeDefinitions.Text.Modify.EnhanceWithKeywords.input,
					conf
				);
				this.nodes.push({ ...NodeDefinitions.Text.Modify.EnhanceWithKeywords, input });
				return new Builder<typeof NodeDefinitions.Text.Modify.EnhanceWithKeywords.output>(
					this.initialInput,
					this.nodes
				);
			},
			simple: (conf: (flow: this) => typeof NodeDefinitions.Text.Modify.Simple.input) => {
				const input = this.getConfiguration(this.nodes, NodeDefinitions.Text.Modify.Simple, conf);
				this.nodes.push({ ...NodeDefinitions.Text.Modify.Simple, input });
				return new Builder<typeof NodeDefinitions.Text.Modify.Simple.output>(
					this.initialInput,
					this.nodes
				);
			},
		},
		prediction: (conf?: (flow: this) => typeof NodeDefinitions.Text.Prediction.input) => {
			const input = this.getConfiguration(this.nodes, NodeDefinitions.Text.Prediction.input, conf);
			this.nodes.push({ ...NodeDefinitions.Text.Prediction, input });
			return new Builder<typeof NodeDefinitions.Text.Prediction.output>(
				this.initialInput,
				this.nodes
			);
		},
	};

	getNodes() {
		return this.nodes;
	}
}

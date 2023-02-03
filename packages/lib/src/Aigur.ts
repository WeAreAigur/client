import { z } from 'zod';

import { generateVercelFunction } from './vercel';
import { Builder } from './builder';

interface AigurConfiguration {
	apiKeys: Record<string, string>;
}

export const createClient = (opts: AigurConfiguration) => {
	const { apiKeys } = opts;
	return {
		pipeline: {
			create: (opts: {
				id: string;
				input: z.RecordType<string, any>;
				output: z.RecordType<string, any>;
				flow: (builder: Builder<typeof opts.input>) => Builder<typeof opts.input>;
			}) => {
				const flow = opts.flow(new Builder(opts.input));
				return {
					vercel: generateVercelFunction({
						id: opts.id,
						input: opts.input,
						output: opts.output,
						flow,
						apiKeys,
					}),
				};
			},
		},
	};
};

// class NodeDefinitions {
// 	static Voice = {
// 		Transcribe: {
// 			id: 'voice.transcribe',
// 			input: {
// 				audio: '',
// 			},
// 			output: {
// 				text: '',
// 			},
// 		},
// 	};

// 	static Text = {
// 		Modify: {
// 			EnhanceWithKeywords: {
// 				id: 'text.modify.enhanceWithKeywords',
// 				input: {
// 					text: '',
// 				},
// 				output: {
// 					text: '',
// 				},
// 			},
// 			simple: async (input: AigurInput): Promise<AigurOutput> => {
// 				return {};
// 			},
// 		},
// 		prediction: async (input: AigurInput): Promise<AigurOutput> => {
// 			return {};
// 		},
// 	};

// 	image = {
// 		sd: {
// 			generate: async (input: AigurInput): Promise<AigurOutput> => {
// 				return {};
// 			},
// 		},
// 	};

// 	result = {
// 		upload: async (input: AigurInput): Promise<AigurOutput> => {
// 			return {};
// 		},
// 	};
// }

// export class FlowBuilder<T> {
// 	private nodes: [AigurNodeDefinition, AigurNodeConfiguration][] = [];

// 	constructor(public input: T) {}
// 	private addNode(node: AigurNodeDefinition, configuration: AigurNodeConfiguration = {}) {
// 		this.nodes.push([node, configuration]);
// 		return this;
// 	}

// 	private getConf(userInput, nodeInput) {
// 		if (Object.keys(nodeInput).length === 1 && Object.keys(userInput).length === 1) {
// 		}

// 		return userInput;
// 	}

// 	// private prev

// 	voice = {
// 		transcribe: (conf?: (flow: this) => typeof NodeDefinitions.Voice.Transcribe.input) => {
// 			const input = conf ? conf(this) : {};
// 			return this.addNode(NodeDefinitions.Voice.Transcribe, input);
// 		},
// 	};

// 	text = {
// 		modify: {
// 			enhanceWithKeywords: (
// 				conf?: (flow: this) => typeof NodeDefinitions.Text.Modify.EnhanceWithKeywords.input
// 			) => {
// 				const input = conf ? conf(this) : {};
// 				return this.addNode(NodeDefinitions.Text.Modify.EnhanceWithKeywords, input);
// 			},
// 			// simple: (conf: (flow: this) => Record<string, any>) => {
// 			// 	const input = conf(this);
// 			// 	return this.addNode(NodeDefinitions.voice.transcribe, input);
// 			// },
// 		},
// 		// prediction: (conf: (flow: this) => Record<string, any>) => {
// 		// 	const input = conf(this);
// 		// 	return this.addNode(NodeDefinitions.voice.transcribe, input);
// 		// },
// 	};

// 	// image = {
// 	// 	sd: {
// 	// 		generate: (conf: (flow: this) => Record<string, any>) => {
// 	// 			const input = conf(this);
// 	// 			return this.addNode(NodeDefinitions.voice.transcribe, input);
// 	// 		},
// 	// 	},
// 	// };

// 	// result = {
// 	// 	upload: (conf: (flow: this) => Record<string, any>) => {
// 	// 		const input = conf(this);
// 	// 		return this.addNode(NodeDefinitions.voice.transcribe, input);
// 	// 	},
// 	// };

// 	done() {
// 		return {
// 			invoke: async (input: T) => {
// 				// this.nodes
// 				return {};
// 			},
// 			onProgress: (cb: (progress: any) => void) => {
// 				return {};
// 			},
// 			onResult: (cb: (result: AigurOutput) => void) => {
// 				return {};
// 			},
// 		};
// 	}
// }

// type AigurInput = any;
// type AigurOutput = any;
// // type AigurNode = (input: AigurInput) => Promise<AigurOutput>;
// type AigurNodeDefinition = {
// 	id: string;
// 	input: AigurInput;
// 	output: AigurOutput;
// };
// type AigurNodeConfiguration = Record<string, any>;

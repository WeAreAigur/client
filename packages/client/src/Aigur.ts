import { z } from 'zod';

import { Builder } from './builder';
import { invokePipeline } from './invokePipeline';
import { ConcreteNode, PipelineConf, ProgressType } from './types';

interface AigurConfiguration {
	apiKeys: Record<string, string> & { openai?: string; stability?: string; googleapis?: string };
}

const DEFAULT_RETRIES = 2;

export const createClient = (opts: AigurConfiguration) => {
	const { apiKeys } = opts;
	return {
		pipeline: {
			create: <Input extends z.AnyZodObject, Output extends z.AnyZodObject>(opts: {
				id: string;
				input: Input;
				output: Output;
				retries?: number;
				flow: (builder: Builder<Input, Output, []>) => Builder<Input, Output, any>;
			}) => {
				const flow = opts.flow(new Builder(opts.input, []));
				const pipelineConf: PipelineConf = {
					id: opts.id,
					input: opts.input,
					output: opts.output,
					flow,
					apiKeys,
					retries: opts.retries ?? DEFAULT_RETRIES,
					progressListeners: {},
				};
				const pipeline = {
					invoke: (input: z.input<Input>) => invokePipeline<Input, Output>(pipelineConf, input),
					invokeRemote: (endpoint: string, input: z.input<Input>): Promise<z.output<Output>> => {
						return fetch(endpoint, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(input),
						}).then((res) => res.json());
					},
					vercel: {
						invoke: (input: z.input<Input>) => {
							// TODO: move base url to "create" optional param
							return pipeline.invokeRemote(`/api/pipelines/${opts.id}`, input);
						},
					},
					onProgress: (cb: (node: ConcreteNode<any, any>, type: ProgressType) => void) => {
						const id = makeid();
						pipelineConf.progressListeners[id] = cb;
						return () => {
							delete pipelineConf.progressListeners[id];
						};
					},
				};

				listenToSSE();

				return pipeline;

				function listenToSSE() {
					if (typeof window !== 'undefined' && apiKeys.ably) {
						const dataEndpoint = `https://realtime.ably.io/event-stream?channels=bla&v=1.2&key=${apiKeys.ably}&enveloped=false`;
						const eventSource = new EventSource(dataEndpoint);
						eventSource.onmessage = (event) => {
							const data = JSON.parse(event.data);
							if (data.name === 'progress') {
								Object.values(pipelineConf.progressListeners).forEach((listener) =>
									listener(data.node, data.type)
								);
							}
						};
					}
				}
			},
		},
	};
};

function makeid(length: number = 16) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

import { z } from 'zod';

import { Builder } from './builder';
import { invokePipeline } from './invokePipeline';
import { ConcreteNode, PipelineConf, ProgressType, ZodReadableStream } from './types';

interface AigurConfiguration {
	apiKeys: Record<string, string> & { openai?: string; stability?: string; googleapis?: string };
}

const DEFAULT_RETRIES = 2;

export const createClient = (opts: AigurConfiguration) => {
	const { apiKeys } = opts;
	return {
		pipeline: {
			create: <
				Input extends z.AnyZodObject,
				Output extends z.AnyZodObject | ZodReadableStream
			>(opts: {
				id: string;
				input: Input;
				output: Output;
				retries?: number;
				stream?: boolean;
				flow: (builder: Builder<Input, Output, []>) => Builder<Input, Output, any>;
			}) => {
				const flow = opts.flow(new Builder(opts.input, []));
				const pipelineConf: PipelineConf = {
					id: opts.id,
					input: opts.input,
					output: opts.output,
					flow,
					apiKeys,
					stream: !!opts.stream,
					retries: opts.retries ?? DEFAULT_RETRIES,
					progressListeners: {},
				};
				const pipeline = {
					conf: pipelineConf,
					invoke: (input: z.input<Input>) => invokePipeline<Input, Output>(pipelineConf, input),
					invokeRemote: (endpoint: string, input: z.input<Input>): Promise<z.output<Output>> => {
						return (
							fetch(endpoint, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify(input),
							})
								// TODO: check response.ok
								// if (!response.ok) {
								// 	throw new Error(response.statusText);
								// }
								.then((res) => res.json())
						);
					},
					invokeStream: async (
						endpoint: string,
						input: z.input<Input>,
						cb: (chunk: string) => void
					): Promise<void> => {
						const response = await fetch(endpoint, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(input),
						});
						if (!response.ok) {
							throw new Error(response.statusText);
						}
						const data = response.body;
						if (!data) {
							return;
						}
						const reader = data.getReader();
						const decoder = new TextDecoder();
						let done = false;

						while (!done) {
							const { value, done: doneReading } = await reader.read();
							done = doneReading;
							const chunkValue = decoder.decode(value);
							console.log(`***value`, value);
							console.log(`***chunkValue`, chunkValue);
							cb(chunkValue);
						}
					},
					vercel: {
						invoke: (input: z.input<Input>) => {
							// TODO: move base url to "create" optional param
							return pipeline.invokeRemote(`/api/pipelines/${opts.id}`, input);
						},
						invokeStream: (input: z.input<Input>, cb: (chunk: z.output<Output>) => void) => {
							// TODO: move base url to "create" optional param
							return pipeline.invokeStream(`/api/pipelines/${opts.id}`, input, cb);
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

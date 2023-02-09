import { z } from 'zod';

import { Builder } from './builder';
import { delay } from './delay';
import { getInputByContext } from './getInputByContext';
import { ConcreteNode, PipelineConf, ProgressType, ZodReadableStream } from './types';

interface AigurConfiguration {
	apiKeys: Record<string, string> & { openai?: string; stability?: string; googleapis?: string };
}

interface PipelineCreateOptions<
	Input extends z.AnyZodObject,
	Output extends z.AnyZodObject | ZodReadableStream
> {
	id: string;
	input: Input;
	output: Output;
	retries?: number;
	stream: boolean;
	flow: (builder: Builder<Input, Output, []>) => Builder<Input, Output, any>;
}

const DEFAULT_RETRIES = 2;

export const createClient = (opts: AigurConfiguration) => {
	const { apiKeys } = opts;
	return {
		pipeline: {
			create: <Input extends z.AnyZodObject, Output extends z.AnyZodObject | ZodReadableStream>({
				id,
				input,
				output,
				flow,
				stream = false,
				retries = DEFAULT_RETRIES,
			}: PipelineCreateOptions<Input, Output>) => {
				const pipelineConf: PipelineConf = {
					id,
					input,
					output,
					flow: flow(new Builder(input, [])),
					apiKeys,
					stream,
					retries,
					retryDelayInMs: 350, // TODO: make configurable
					updateProgress: false, // TODO: make configurable
				};

				return new Pipeline(pipelineConf);
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

class Pipeline<Input extends z.AnyZodObject, Output extends z.AnyZodObject | ZodReadableStream> {
	public readonly progressListeners: Map<
		string,
		(node: ConcreteNode<any, any>, type: ProgressType) => void
	> = new Map();

	constructor(public readonly conf: PipelineConf) {
		this.listenToProgressEvents();
	}

	public invoke(input: z.input<Input>) {
		return this.invokePipeline<Input, Output>(this.conf, input);
	}

	public invokeRemote(endpoint: string, input: z.input<Input>): Promise<z.output<Output>> {
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
	}

	public async invokeStream(
		endpoint: string,
		input: z.input<Input>,
		cb: (chunk: string) => void
	): Promise<void> {
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
	}

	public vercel = {
		invoke: (input: z.input<Input>) => {
			// TODO: move base url to "create" optional param
			return this.invokeRemote(`/api/pipelines/${this.conf.id}`, input);
		},
		invokeStream: (input: z.input<Input>, cb: (chunk: string) => void) => {
			// TODO: move base url to "create" optional param
			return this.invokeStream(`/api/pipelines/${this.conf.id}`, input, cb);
		},
	};

	public onProgress(cb: (node: ConcreteNode<any, any>, type: ProgressType) => void) {
		const id = makeid();
		this.progressListeners[id] = cb;
		return () => {
			delete this.progressListeners[id];
		};
	}

	private listenToProgressEvents() {
		if (this.conf.updateProgress && typeof window !== 'undefined' && this.conf.apiKeys.ably) {
			const dataEndpoint = `https://realtime.ably.io/event-stream?channels=bla&v=1.2&key=${this.conf.apiKeys.ably}&enveloped=false`;
			const eventSource = new EventSource(dataEndpoint);
			eventSource.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.name === 'progress') {
					Object.values(this.progressListeners).forEach((listener) =>
						listener(data.node, data.type)
					);
				}
			};
		}
	}

	private async invokePipeline<
		Input extends z.AnyZodObject,
		Output extends z.AnyZodObject | ZodReadableStream
	>(pipeline: PipelineConf, input: z.input<Input>): Promise<z.output<Output>> {
		try {
			pipeline.input.parse(input);
			const values: any = { input };
			let lastValue: any = {};
			const nodes: any[] = pipeline.flow.getNodes();

			let startProgressPromise;

			for (let i = 0; i < nodes.length; i++) {
				startProgressPromise = this.notifyProgress(nodes[i], 'start');
				let attemptCount = 0;
				let isSuccess = false;
				do {
					attemptCount++;
					try {
						lastValue = await executeAction(nodes, i);
						values[i] = lastValue;
						isSuccess = true;
					} catch (e) {
						if (attemptCount > pipeline.retries) {
							throw e;
						}
						await delay(this.conf.retryDelayInMs * attemptCount);
					}
				} while (!isSuccess && attemptCount <= pipeline.retries);
				// we wait here as to not delay the execution itself
				await startProgressPromise;
				await this.notifyProgress(nodes[i], 'end');
			}

			return lastValue;

			async function executeAction(nodes, index) {
				const { action, schema, input } = nodes[index];
				return action(getInputByContext(input, values), pipeline.apiKeys) as typeof schema.output;
			}
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	private notifyProgress(node: any, type: 'start' | 'end' | 'stream') {
		if (
			!this.conf.updateProgress ||
			Object.keys(this.progressListeners).length === 0 ||
			!this.conf.apiKeys.ably
		) {
			return;
		}
		return fetch('https://rest.ably.io/channels/bla/messages?enveloped=false ', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Basic ${btoa(this.conf.apiKeys.ably)}`,
			},
			body: JSON.stringify({
				name: 'progress',
				data: {
					node,
					type,
				},
			}),
		});
	}
}

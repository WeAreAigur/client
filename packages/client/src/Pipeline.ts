import { z } from 'zod';

import { APIKeys, ConcreteNode, PipelineConf, ProgressType, ZodReadableStream } from './types';
import { makeid } from './makeid';
import { getInputByContext } from './getInputByContext';
import { delay } from './delay';
import { Builder } from './builder';

const DEFAULT_RETRIES = 2;
const RETRY_DELAY_IN_MS = 350;

export class Pipeline<
	Input extends z.AnyZodObject,
	Output extends z.AnyZodObject | ZodReadableStream
> {
	public readonly progressListeners: Map<
		string,
		(node: ConcreteNode<any, any>, type: ProgressType) => void
	> = new Map();

	constructor(
		public readonly conf: PipelineConf<Input, Output>,
		public readonly flow: Builder<z.AnyZodObject, z.AnyZodObject, [], null>,
		private readonly apiKeys: APIKeys
	) {
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
			cb(chunkValue);
		}
	}

	public vercel = {
		invoke: (input: z.input<Input>): Promise<z.output<Output>> => {
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
		if (this.conf.updateProgress && typeof window !== 'undefined' && this.apiKeys?.ably) {
			const dataEndpoint = `https://realtime.ably.io/event-stream?channels=bla&v=1.2&key=${this.apiKeys.ably}&enveloped=false`;
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
	>(pipeline: PipelineConf<Input, Output>, input: z.input<Input>): Promise<z.output<Output>> {
		const retriesCount = this.conf.retries ?? DEFAULT_RETRIES;
		try {
			pipeline.input.parse(input);
			const values: any = { input };
			let lastValue: any = {};
			const nodes: any[] = this.flow.getNodes();

			let startProgressPromise;

			for (let i = 0; i < nodes.length; i++) {
				startProgressPromise = this.notifyProgress(nodes[i], 'start');
				let attemptCount = 0;
				let isSuccess = false;
				do {
					attemptCount++;
					try {
						lastValue = await this.executeAction(nodes, i, values);
						values[i] = lastValue;
						isSuccess = true;
					} catch (e) {
						if (attemptCount > retriesCount) {
							throw e;
						}
						await delay((this.conf.retryDelayInMs ?? RETRY_DELAY_IN_MS) * attemptCount);
					}
				} while (!isSuccess && attemptCount <= retriesCount);
				// we wait here as to not delay the execution itself
				await startProgressPromise;
				await this.notifyProgress(nodes[i], 'end');
			}

			return lastValue;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	private async executeAction(nodes, index, values) {
		const { action, schema, input } = nodes[index];
		const inputByContext = getInputByContext(input, values);
		return action(inputByContext, this.apiKeys) as typeof schema.output;
	}

	private notifyProgress(node: any, type: 'start' | 'end' | 'stream') {
		if (
			!this.conf.updateProgress ||
			Object.keys(this.progressListeners).length === 0 ||
			!this.apiKeys.ably
		) {
			return;
		}
		return fetch('https://rest.ably.io/channels/bla/messages?enveloped=false ', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Basic ${btoa(this.apiKeys.ably)}`,
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

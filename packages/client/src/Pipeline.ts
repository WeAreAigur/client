import { z } from 'zod';

import {
    APIKeys, ConcreteNode, EventType, PipelineConf, ProgressEventType, ZodReadableStream
} from './types';
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
	public readonly onProgressListeners: Map<
		string,
		(args: { node: ConcreteNode<any, any>; type: ProgressEventType; index: number }) => void
	> = new Map();
	public readonly onStartListeners: Map<string, () => void> = new Map();
	public readonly onFinishListeners: Map<string, () => void> = new Map();

	constructor(
		public readonly conf: PipelineConf<Input, Output>,
		public readonly flow: Builder<z.AnyZodObject, z.AnyZodObject, [], null>,
		private readonly apiKeys: APIKeys
	) {
		this.listenToEvents();
	}

	public invoke(input: z.input<Input>) {
		return this.processPipeline<Input, Output>(this.conf, input);
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

	public onProgress(
		cb: (args: { node: ConcreteNode<any, any>; type: ProgressEventType; index: number }) => void
	) {
		const id = makeid();
		this.onProgressListeners.set(id, cb);
		return () => {
			this.onProgressListeners.delete(id);
		};
	}

	public onStart(cb: () => void) {
		const id = makeid();
		this.onStartListeners.set(id, cb);
		return () => {
			this.onStartListeners.delete(id);
		};
	}

	public onFinish(cb: () => void) {
		const id = makeid();
		this.onFinishListeners.set(id, cb);
		return () => {
			this.onFinishListeners.delete(id);
		};
	}

	private listenToEvents() {
		if (
			!this.conf.updateProgress ||
			typeof window === 'undefined' ||
			!this.apiKeys?.ablySubscribe
		) {
			return;
		}
		// TODO: move channel name to config
		const dataEndpoint = `https://realtime.ably.io/event-stream?channels=aigur-client&v=1.2&key=${this.apiKeys.ablySubscribe}&enveloped=false`;
		const eventSource = new EventSource(dataEndpoint);
		eventSource.onmessage = (event) => {
			const e: { type: EventType; data: Record<any, any> } = JSON.parse(event.data);
			if (e.type === 'pipeline:start') {
				this.triggerListeners(this.onStartListeners);
			} else if (e.type === 'pipeline:finish') {
				this.triggerListeners(this.onFinishListeners);
			} else if (e.type === 'node:start' || e.type === 'node:finish') {
				this.triggerListeners(this.onProgressListeners, { ...e.data, type: e.type });
			}
		};
	}

	private triggerListeners(listeners: Map<string, (...args: any[]) => void>, ...args: any[]) {
		for (let listener of listeners.values()) {
			listener(...args);
		}
	}

	private async processPipeline<
		Input extends z.AnyZodObject,
		Output extends z.AnyZodObject | ZodReadableStream
	>(pipeline: PipelineConf<Input, Output>, input: z.input<Input>): Promise<z.output<Output>> {
		const retriesCount = this.conf.retries ?? DEFAULT_RETRIES;
		try {
			await this.notifyEvent('pipeline:start');
			pipeline.input.parse(input);
			const values: any = { input };
			let output: any = {};
			const nodes: any[] = this.flow.getNodes();

			let startProgressPromise;

			for (let i = 0; i < nodes.length; i++) {
				startProgressPromise = this.notifyEvent('node:start', { node: nodes[i], index: i });
				let attemptCount = 0;
				let isSuccess = false;
				do {
					attemptCount++;
					try {
						output = await this.executeAction(nodes, i, values);
						values[i] = output;
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
				await this.notifyEvent('node:finish', { node: nodes[i], index: i });
			}

			await this.notifyEvent('pipeline:finish');
			return output;
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

	private notifyEvent(type: EventType, data?: Record<any, any>) {
		if (!this.conf.updateProgress || !this.apiKeys.ablyPublish) {
			return;
		}

		return fetch('https://rest.ably.io/channels/aigur-client/messages?enveloped=false ', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Basic ${btoa(this.apiKeys.ablyPublish)}`,
			},
			body: JSON.stringify({
				type,
				data,
			}),
		});
	}
}

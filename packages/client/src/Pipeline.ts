import { FlowBuilder } from './builder';
import { delay } from './delay';
import { getInputByContext } from './getInputByContext';
import { makeid } from './makeid';
import { APIKeys, ConcreteNode, EventType, PipelineConf, ProgressEventType } from './types';

const DEFAULT_RETRIES = 2;
const RETRY_DELAY_IN_MS = 350;

export class Pipeline<
	Input extends Record<string, unknown>,
	Output extends Record<string, unknown> | ReadableStream
> {
	public readonly onProgressListeners: Map<
		string,
		(args: { node: ConcreteNode<any, any>; type: ProgressEventType; index: number }) => void
	> = new Map();
	public readonly onStartListeners: Map<string, () => void> = new Map();
	public readonly onFinishListeners: Map<string, () => void> = new Map();

	constructor(
		public readonly conf: PipelineConf<Input, Output>,
		public readonly flow: FlowBuilder<Input, Output, any, any>,
		private readonly apiKeys: APIKeys
	) {
		this.listenToEvents();
	}

	public invoke(input: Input) {
		return this.processPipeline(input);
	}

	public invokeRemote(endpoint: string, input: Input): Promise<Output> {
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
		input: Input,
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
		invoke: (input: Input): Promise<Output> => {
			// TODO: move base url to "create" optional param
			return this.invokeRemote(`/api/pipelines/${this.conf.id}?_vercel_no_cache=1`, input);
		},
		invokeStream: (input: Input, cb: (chunk: string) => void) => {
			// TODO: move base url to "create" optional param
			return this.invokeStream(`/api/pipelines/${this.conf.id}?_vercel_no_cache=1`, input, cb);
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
			const e: { pipelineId: string; type: EventType; data: Record<any, any> } = JSON.parse(
				event.data
			);
			if (e.pipelineId !== this.conf.id) {
				return;
			}
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

	private async processPipeline(input: Input): Promise<Output> {
		const retriesCount = this.conf.retries ?? DEFAULT_RETRIES;
		try {
			await this.notifyEvent('pipeline:start');
			if (this.conf.validateInput) {
				const result = this.conf.validateInput(input);
				if (!result.valid) {
					throw new Error(result.message);
				}
			}
			const values: any = { input };
			let output: any = {};
			const nodes: any[] = this.flow.getNodes();

			let startProgressPromise;

			for (let i = 0; i < nodes.length; i++) {
				startProgressPromise = this.notifyEvent('node:start', { node: nodes[i].name, index: i });
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
				await this.notifyEvent('node:finish', { node: nodes[i].name, index: i });
			}

			await this.notifyEvent('pipeline:finish');
			return output;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	private async executeAction(nodes, index, values) {
		const { action, input } = nodes[index];
		const inputByContext = getInputByContext(input, values);
		return action(inputByContext, this.apiKeys);
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
				pipelineId: this.conf.id,
			}),
		});
	}
}

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
	private readonly pipelineInstanceId = makeid(16);

	constructor(
		public readonly conf: PipelineConf<Input, Output>,
		public readonly flow: FlowBuilder<Input, Output, any, any>,
		private readonly apiKeys: APIKeys
	) {
		this.listenToEvents();
	}

	public invoke(input: Input, pipelineInstanceId: string = this.pipelineInstanceId) {
		return this.processPipeline(input, pipelineInstanceId);
	}

	public invokeRemote(endpoint: string, input: Input): Promise<Output> {
		return (
			fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					input,
					pipelineInstanceId: this.pipelineInstanceId,
				}),
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
			body: JSON.stringify({
				input,
				pipelineInstanceId: this.pipelineInstanceId,
			}),
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
			console.log(`reading chunk`);
			const { value, done: doneReading } = await reader.read();
			done = doneReading;
			const chunkValue = decoder.decode(value);
			console.log(`***chunkValue`, chunkValue);
			cb(chunkValue);
		}
	}

	public vercel = {
		invoke: (input: Input): Promise<Output> => {
			// TODO: move base url to "create" optional param
			return this.invokeRemote(`/api/pipelines/${this.conf.id}`, input);
		},
		invokeStream: (input: Input, cb: (chunk: string) => void) => {
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

	private async processPipeline(input: Input, pipelineInstanceId: string): Promise<Output> {
		const retriesCount = this.conf.retries ?? DEFAULT_RETRIES;
		try {
			await this.notifyEvent('pipeline:start', pipelineInstanceId);
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
				startProgressPromise = this.notifyEvent('node:start', pipelineInstanceId, {
					node: nodes[i].name,
					index: i,
				});
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
				await this.notifyEvent('node:finish', pipelineInstanceId, {
					node: nodes[i].name,
					index: i,
				});
			}

			await this.notifyEvent('pipeline:finish', pipelineInstanceId);
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

	private listenToEvents() {
		if (!this.conf.updateProgress || typeof window === 'undefined' || !this.conf.eventListener) {
			return;
		}

		this.conf.eventListener(this.pipelineInstanceId, (event) => {
			if (event.pipelineId !== this.conf.id) {
				return;
			}
			if (event.type === 'pipeline:start') {
				this.triggerListeners(this.onStartListeners);
			} else if (event.type === 'pipeline:finish') {
				this.triggerListeners(this.onFinishListeners);
			} else if (event.type === 'node:start' || event.type === 'node:finish') {
				this.triggerListeners(this.onProgressListeners, { ...event.data, type: event.type });
			}
		});
	}

	private triggerListeners(listeners: Map<string, (...args: any[]) => void>, ...args: any[]) {
		for (let listener of listeners.values()) {
			listener(...args);
		}
	}

	private notifyEvent(type: EventType, pipelineInstanceId: string, data?: Record<any, any>) {
		if (!this.conf.updateProgress || !this.conf.eventPublisher) {
			return;
		}
		return this.conf.eventPublisher(pipelineInstanceId, { type, data, pipelineId: this.conf.id });
	}
}

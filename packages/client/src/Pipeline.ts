import { FlowBuilder } from './builder';
import { delay } from './delay';
import { placeholdersToConcreteValues } from './getConcreteNodeInput';
import { makeid } from './makeid';
import { createContext } from './PipelineContext';
import { retrieveConcreteMemoryData } from './retrieveMemoryData';
import {
	APIKeys,
	ConcreteNode,
	EventType,
	PipelineConf,
	PipelineContext,
	PipelineProgressEvent,
	PipelineStatusEvent,
} from './types';

const DEFAULT_RETRIES = 2;
const RETRY_DELAY_IN_MS = 350;

export class Pipeline<
	Input extends Record<string, unknown>,
	Output extends Record<string, unknown> | ReadableStream,
	MemoryData extends Record<string, unknown>
> {
	public readonly onProgressListeners: Map<string, (event: PipelineProgressEvent) => void> =
		new Map();
	public readonly onStartListeners: Map<string, (event: PipelineStatusEvent) => void> = new Map();
	public readonly onFinishListeners: Map<string, (event: PipelineStatusEvent) => void> = new Map();
	private readonly pipelineInstanceId = makeid(16);
	private eventIndex = 0;

	constructor(
		public readonly conf: PipelineConf<Input, Output, MemoryData>,
		public readonly flow: FlowBuilder<Input, Output, MemoryData, any, any>,
		private readonly apiKeys: APIKeys
	) {
		this.listenToEvents();
	}

	public async invoke(
		input: Input,
		opts?: {
			pipelineInstanceId?: string;
			userId?: string;
		}
	) {
		const memory = await this.loadMemory(opts?.userId);
		const context = createContext<Input, Output, MemoryData>({
			input,
			pipelineInstanceId: opts?.pipelineInstanceId ?? this.pipelineInstanceId,
			userId: opts?.userId ?? '',
			memory,
		});
		await this.processPipeline(context);
		return context.output;
	}

	private async saveMemory(
		context: PipelineContext<Input, Output, MemoryData>,
		memoryToSavePromise: Promise<Partial<MemoryData> | null>
	) {
		const memoryToSave = await memoryToSavePromise;
		if (!this.conf.memoryManager || !memoryToSave) {
			return;
		}

		this.conf.memoryManager.saveMemory(this.getMemoryId(context.userId), memoryToSave);
	}

	private getMemoryId(userId?: string) {
		return `${this.conf.id}${userId ? `-${userId}` : ''}`;
	}

	private loadMemory(userId?: string): Promise<MemoryData | null> {
		if (!this.conf.memoryManager) {
			return Promise.resolve(null);
		}
		return this.conf.memoryManager.loadMemory(this.getMemoryId(userId));
	}

	public invokeRemote(
		endpoint: string,
		input: Input,
		opts?: {
			userId?: string;
		}
	): Promise<Output> {
		return (
			fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					input,
					pipelineInstanceId: this.pipelineInstanceId,
					userId: opts?.userId ?? '',
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
		cb: (chunk: string) => void,
		opts?: {
			userId?: string;
		}
	): Promise<void> {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				input,
				pipelineInstanceId: this.pipelineInstanceId,
				userId: opts?.userId ?? '',
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
			const { value, done: doneReading } = await reader.read();
			done = doneReading;
			const chunkValue = decoder.decode(value);
			cb(chunkValue);
		}
	}

	public vercel = {
		invoke: (
			input: Input,
			opts?: {
				userId?: string;
			}
		): Promise<Output> => {
			// TODO: move base url to "create" optional param
			return this.invokeRemote(`/api/pipelines/${this.conf.id}`, input, { userId: opts?.userId });
		},
		invokeStream: (
			input: Input,
			cb: (chunk: string) => void,
			opts?: {
				userId?: string;
			}
		) => {
			// TODO: move base url to "create" optional param
			return this.invokeStream(`/api/pipelines/${this.conf.id}`, input, cb, {
				userId: opts?.userId,
			});
		},
	};

	public onProgress(cb: (args: PipelineProgressEvent) => void) {
		const id = makeid();
		this.onProgressListeners.set(id, cb);
		return () => {
			this.onProgressListeners.delete(id);
		};
	}

	public onStart(cb: (event: PipelineStatusEvent) => void) {
		const id = makeid();
		this.onStartListeners.set(id, cb);
		return () => {
			this.onStartListeners.delete(id);
		};
	}

	public onFinish(cb: (event: PipelineStatusEvent) => void) {
		const id = makeid();
		this.onFinishListeners.set(id, cb);
		return () => {
			this.onFinishListeners.delete(id);
		};
	}

	private async processPipeline(
		context: PipelineContext<Input, Output, MemoryData>
	): Promise<PipelineContext<Input, Output, MemoryData>> {
		const retriesCount = this.conf.retries ?? DEFAULT_RETRIES;
		try {
			const pipelineStartPromise = this.notifyEvent({ type: 'pipeline:start', context });
			if (!this.conf.stream) {
				await pipelineStartPromise;
			}
			if (this.conf.validateInput) {
				const result = this.conf.validateInput(context.input);
				if (!result.valid) {
					// TODO: notifyEvent on error
					throw new Error(result.message);
				}
			}
			const nodes: ConcreteNode<any, any, any>[] = this.flow.getNodes();

			for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
				const nodeStartPromise = this.notifyEvent({
					type: 'node:start',
					context,
					data: {
						node: nodes[nodeIndex].action.name,
						index: nodeIndex,
					},
				});
				if (!this.conf.stream) {
					await nodeStartPromise;
				}
				let attemptCount = 0;
				let isSuccess = false;
				do {
					attemptCount++;
					try {
						const { action, input: inputPlaceholders, memoryToSave } = nodes[nodeIndex];
						const contextNode = (context.values[nodeIndex] = { input: null, output: null });
						contextNode.input = placeholdersToConcreteValues(inputPlaceholders, context.values);
						contextNode.output = await action(contextNode.input, this.apiKeys);
						const memoryValuesPromise = retrieveConcreteMemoryData(context, nodes[nodeIndex]);
						this.saveMemory(context, memoryValuesPromise);
						isSuccess = true;
					} catch (e) {
						if (attemptCount > retriesCount) {
							throw e;
						}
						await delay((this.conf.retryDelayInMs ?? RETRY_DELAY_IN_MS) * attemptCount);
					}
				} while (!isSuccess && attemptCount <= retriesCount);
				const nodeEndPromise = this.notifyEvent({
					type: 'node:finish',
					context,
					data: {
						node: nodes[nodeIndex].action.name,
						index: nodeIndex,
					},
				});
				if (!this.conf.stream) {
					await nodeEndPromise;
				}
			}
			const pipelineFinishPromise = this.notifyEvent({
				type: 'pipeline:finish',
				context,
			});
			if (!this.conf.stream) {
				await pipelineFinishPromise;
			}

			context.output = context.values[nodes.length - 1].output;
			return context;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	private listenToEvents() {
		if (!this.conf.updateProgress || typeof window === 'undefined' || !this.conf.eventListener) {
			return;
		}

		this.conf.eventListener(this.pipelineInstanceId, (event) => {
			if (event.pipelineId !== this.conf.id) {
				return;
			}
			// TODO: move to lookup object
			if (event.type === 'node:start' || event.type === 'node:finish') {
				this.triggerListeners(this.onProgressListeners, event);
			} else if (event.type === 'pipeline:start') {
				this.triggerListeners(this.onStartListeners, event);
			} else if (event.type === 'pipeline:finish') {
				this.triggerListeners(this.onFinishListeners, event);
			}
		});
	}

	private triggerListeners(listeners: Map<string, (...args: any[]) => void>, ...args: any[]) {
		for (let listener of listeners.values()) {
			listener(...args);
		}
	}

	private notifyEvent(opts: {
		type: EventType;
		context: PipelineContext<Input, Output, MemoryData>;
		data?: Record<any, any>;
	}) {
		if (!this.conf.updateProgress || !this.conf.eventPublisher) {
			return;
		}
		return this.conf.eventPublisher(opts.context.pipelineInstanceId, {
			pipelineId: this.conf.id,
			eventIndex: this.eventIndex++,
			type: opts.type,
			data: opts.data,
		});
	}
}

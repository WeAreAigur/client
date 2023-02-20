// export type EventType = PipelineEventType | ProgressEventType;
export type EventType = any;
export type PipelineEventType = 'pipeline:start' | 'pipeline:finish';
export type ProgressEventType = 'node:start' | 'node:finish' | 'node:stream';
export type PipelineEvent = any;
// export type PipelineEvent = { type: EventType; data?: Record<any, any>; pipelineId: string };

/**
 * @typedef {Object} AblyNotifier
 * @property {(ablyPublishKey: string, ablySubscribeKey: string, channel: string) => Promise<Response>} eventPublisher - Used to publish an event to the channel
 * @property {(cb: (event: PipelineEvent) => void) => void} eventListener - Used to subscribe to events on the channel
 */

/**
 * Returns functions used to configure Ably as the event notifier
 * @param {string} ablyPublishKey - The key used to publish events to the channel
 * @param {string} ablySubscribeKey - The key used to subscribe to events on the channel (splitting this out for security)
 * @param channel - The channel to publish and subscribe to
 * @returns {AblyNotifier}
 */
export function createAblyNotifier(
	ablyPublishKey: string,
	ablySubscribeKey: string,
	channel: string
) {
	const id = makeid(16);
	const channelName = `${channel}-${id}`;
	return {
		eventPublisher,
		eventListener,
	};

	function eventPublisher(event: PipelineEvent) {
		if (!ablyPublishKey) {
			return Promise.resolve();
		}

		return fetch(`https://rest.ably.io/channels/${channelName}/messages?enveloped=false`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Basic ${btoa(ablyPublishKey)}`,
			},
			body: JSON.stringify(event),
		});
	}

	function eventListener(cb: (event: PipelineEvent) => void) {
		const dataEndpoint = `https://realtime.ably.io/event-stream?channels=${channelName}&v=1.2&key=${ablySubscribeKey}&enveloped=false`;
		const eventSource = new EventSource(dataEndpoint);
		eventSource.onmessage = (event) => cb(JSON.parse(event.data));
	}
}

export function makeid(length: number = 16) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

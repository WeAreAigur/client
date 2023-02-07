import { PipelineConf } from './types';

export function notifyProgress(
	pipeline: PipelineConf,
	node: any,
	type: 'start' | 'end' | 'stream'
) {
	if (Object.keys(pipeline.progressListeners).length === 0 || !pipeline.apiKeys.ably) {
		return;
	}
	// Object.values(pipeline.progressListeners).forEach((listener) => listener(node, type));
	return fetch('https://rest.ably.io/channels/bla/messages?enveloped=false ', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${btoa(pipeline.apiKeys.ably)}`,
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

import { useEffect } from 'react';

import { useRecord } from '../hooks/useRecord';

export default function Web() {
	const { toggleRecording, result, isRecording } = useRecord();
	useEffect(() => {
		if (result) {
			fetch('/api/whisper', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ audio: result }),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log('received result:', data);
				});
		}
	}, [result]);
	return (
		<div>
			<h1>Web</h1>
			<button onClick={toggleRecording}>{isRecording ? 'Stop' : 'Start'}</button>
		</div>
	);
}

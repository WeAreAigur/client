import { useState } from 'react';

export function useRecord() {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [isRecording, setIsRecording] = useState(false);
	const [result, setResult] = useState<string | null>(null);
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

	function startRecording() {
		if (navigator.mediaDevices) {
			navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
				setHasPermission(true);
				setIsRecording(true);
				const mediaRecorder = new MediaRecorder(stream);
				setMediaRecorder(mediaRecorder);
				mediaRecorder.start();
				let audioChunks: Blob[] = [];
				mediaRecorder.addEventListener('dataavailable', (event) => {
					audioChunks.push(event.data);
				});
				mediaRecorder.addEventListener('stop', async () => {
					const audioBlob = new Blob(audioChunks, { type: 'audio/ogg; codecs=opus' });
					const buf = Buffer.from(await audioBlob.arrayBuffer());
					setResult(buf.toString('base64'));
					audioChunks = [];
				});
			});
		} else {
			setHasPermission(false);
		}
	}

	async function stopRecording() {
		mediaRecorder?.stop();
		setIsRecording(false);
	}

	function toggleRecording() {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	}

	return { startRecording, stopRecording, isRecording, result, toggleRecording, hasPermission };
}

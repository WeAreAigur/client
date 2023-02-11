import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRecord } from '#/hooks/useRecord';

import { VoiceRecorder } from './VoiceRecorder';

// jokeGptPipeline.onProgress((node, type) => {
// 	console.log('progress', node, type);
// });

interface VoiceToImageProps {}

export function VoiceToImage(props: VoiceToImageProps) {
	const { toggleRecording, isRecording, result } = useRecord();
	const [inProgress, setInProgress] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState<string>('');
	const [keywords, setKeywords] = useState<string>('');
	const [transcription, setTranscription] = useState<string>('');

	useEffect(() => {
		if (result) {
			setInProgress(true);
			import('#/pipelines/pipelines')
				.then((mod) => mod.pipelines)
				.then(async ({ voiceToImage }) => {
					const { url, keywords, transcription } = await voiceToImage.vercel.invoke({
						audio: result,
					});
					setImageUrl(url);
					setKeywords(keywords.trim());
					setTranscription(transcription);
					setInProgress(false);
				});
		}
	}, [result]);

	return (
		<div className="flex flex-col items-center py-6 space-y-4">
			<VoiceRecorder toggleRecording={toggleRecording} isRecording={isRecording} />
			{inProgress ? (
				'Transcribing audio, enhancing prompt and creating image...'
			) : imageUrl ? (
				<div>
					<div className="text-lg">
						<Image width={512} height={512} src={imageUrl} alt={`${transcription} - ${keywords}`} />
					</div>
					<div className="text-sm">Transcription: {transcription}</div>
					<div className="text-sm">Enhanced Prompt: {keywords}</div>
				</div>
			) : null}
		</div>
	);
}

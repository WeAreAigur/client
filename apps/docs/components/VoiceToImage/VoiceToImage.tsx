import { useEffect, useState } from 'react';
import Image from 'next/image';
import { pipelines } from '#/pipelines/pipelines';
import { useRecord } from '#/hooks/useRecord';

import { VoiceToImagePipelineView } from './VoiceToImagePipelineView';
import { VoiceRecorder } from './VoiceRecorder';

interface VoiceToImageProps {}

export function VoiceToImage(props: VoiceToImageProps) {
	const { toggleRecording, isRecording, result } = useRecord();
	const [inProgress, setInProgress] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState<string>('');
	const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
	const [transcription, setTranscription] = useState<string | null>(null);

	useEffect(() => {
		if (result) {
			setInProgress(true);
			setEnhancedPrompt(null);
			setTranscription(null);

			pipelines.voiceToImage.vercel
				.invoke({
					audio: result,
				})
				.then(({ url, enhancedPrompt, transcription }) => {
					setImageUrl(url);
					setEnhancedPrompt(enhancedPrompt.trim());
					setTranscription(transcription);
					setInProgress(false);
				});
		}
	}, [result]);

	return (
		<div className="flex flex-col pt-8 space-y-8 md:space-y-0 md:space-x-8 md:flex-row">
			<div className="flex flex-col items-center flex-1 space-y-4 md:w-1/2">
				<VoiceRecorder toggleRecording={toggleRecording} isRecording={isRecording} />
				<div className="text-sm">
					Try saying things like: a small house, a red car, an ivory castle, an empty street
				</div>
				<div className="flex flex-col space-y-6">
					{imageUrl ? (
						<Image
							className="rounded-lg"
							width={512}
							height={512}
							src={imageUrl}
							alt={`${transcription} - ${enhancedPrompt}`}
						/>
					) : (
						<div className="flex items-center justify-center p-16 border rounded-lg border-accent">
							<div className="text-sm text-accent">No image yet</div>
						</div>
					)}
					<div>
						<div className="text-sm">
							<span className="text-lg font-bold">Transcription: </span>
							{transcription ?? 'N/A'}
						</div>
						<div className="text-sm">
							<span className="text-lg font-bold">Enhanced Prompt: </span>
							{enhancedPrompt ?? 'N/A'}
						</div>
					</div>
				</div>
			</div>
			<div className="flex-1 md:w-1/2">
				<VoiceToImagePipelineView isActive={inProgress} pipeline={pipelines.voiceToImage} />
			</div>
		</div>
	);
}

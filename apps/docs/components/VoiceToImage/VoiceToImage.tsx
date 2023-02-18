import { useRecord } from '#/hooks/useRecord';
import { pipelines } from '#/pipelines/pipelines';
import { logsnag } from '#/services/logsnag';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { premadeAudio } from './premadeAudio';
import { VoiceRecorder } from './VoiceRecorder';
import { VoiceToImagePipelineView } from './VoiceToImagePipelineView';

interface VoiceToImageProps {}

export function VoiceToImage(props: VoiceToImageProps) {
	const { toggleRecording, isRecording, result } = useRecord();
	const [inProgress, setInProgress] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState<string>('');
	const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
	const [transcription, setTranscription] = useState<string | null>(null);

	useEffect(() => {
		if (result) {
			invokePipeline(result);
		}
	}, [result]);

	function invokePipeline(audio: string) {
		logsnag.publish({
			channel: 'client',
			notify: true,
			event: 'VoiceToImage',
		});
		setInProgress(true);
		setEnhancedPrompt(null);
		setTranscription(null);
		setImageUrl('');
		pipelines.voiceToImage.vercel
			.invoke({
				audio,
			})
			.then(({ url, enhancedPrompt, transcription }) => {
				setImageUrl(url);
				setEnhancedPrompt(enhancedPrompt.trim());
				setTranscription(transcription);
				setInProgress(false);
			});
	}

	return (
		<div className="flex flex-col pt-8 space-y-8 md:space-y-0 md:space-x-8 md:flex-row">
			<div className="flex flex-col items-center flex-1 space-y-4 md:w-1/2">
				<VoiceRecorder toggleRecording={toggleRecording} isRecording={isRecording} />
				<div className="text-sm">
					Try saying things like: a small house, a sports car, an large balloon, an empty street
				</div>
				<div className="space-y-4">
					<div>Use one of these examples if you&apos;re too lazy:</div>
					<div className="flex flex-wrap gap-2">
						{Object.entries(premadeAudio).map(([key, example]) => (
							<button
								key={example}
								className="btn btn-sm btn-primary"
								onClick={() => invokePipeline(example)}
							>
								{key}
							</button>
						))}
					</div>
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
							<div className="text-sm text-accent">
								{inProgress ? 'Generating Image' : 'No image yet'}
							</div>
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

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRecord } from '#/hooks/useRecord';

import { VoiceToImagePipelineView } from './VoiceToImagePipelineView';
import { VoiceRecorder } from './VoiceRecorder';

import type { Pipeline } from '@aigur/client/src/Pipeline';
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
	const [inProgressNode, setInProgressNode] = useState<string>('');
	const [doneNodes, setDoneNodes] = useState<string[]>([]);
	const [pipeline, setPipeline] = useState<Pipeline<any, any> | null>(null);

	useEffect(() => {
		if (result) {
			setInProgress(true);
			import('#/pipelines/pipelines')
				.then((mod) => mod.pipelines)
				.then(async ({ voiceToImage }) => {
					// voiceToImage.onProgress((node, type, index) => {
					// 	console.log(`***node`, node, type);
					// 	if (type === 'start') {
					// 		setInProgressNode(index.toString());
					// 	} else if (type === 'end') {
					// 		setDoneNodes((prev) => [...prev, index.toString()]);
					// 	}
					// });
					setPipeline(voiceToImage);

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
		<div className="flex flex-col space-y-8 md:space-y-0 md:space-x-8 md:flex-row">
			<div className="flex flex-col items-center flex-1 py-6 space-y-4 md:w-1/2">
				<div>In Progress - {inProgressNode}</div>
				<div>Done - {doneNodes.join(', ')}</div>
				<VoiceRecorder toggleRecording={toggleRecording} isRecording={isRecording} />
				<div className="text-sm">
					Try saying things like: a small house, a red car, an ivory castle, an empty street
				</div>
				{imageUrl ? (
					<div className="flex flex-col space-y-6">
						<div className="text-lg">
							<Image
								className="rounded-lg"
								width={512}
								height={512}
								src={imageUrl}
								alt={`${transcription} - ${keywords}`}
							/>
						</div>
						<div className="text-sm">Transcription: {transcription}</div>
						<div className="text-sm">Enhanced Prompt: {keywords}</div>
					</div>
				) : null}
			</div>
			<div className="flex-1 md:w-1/2">
				<VoiceToImagePipelineView
					isActive={inProgress}
					getPipeline={() =>
						import('#/pipelines/pipelines')
							.then((mod) => mod.pipelines)
							.then(({ voiceToImage }) => voiceToImage)
					}
					doneProgressIds={doneNodes}
					inProgressNodeId={inProgressNode}
				/>
			</div>
		</div>
	);
}

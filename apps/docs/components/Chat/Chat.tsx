import { useEffect, useRef, useState } from 'react';
import { getUserId } from '#/services/user';
import { logsnag } from '#/services/logsnag';
import { pipelines } from '#/pipelines/pipelines';

import { ChatPipelineView } from './ChatPipelineView';
import { Tabs } from '../Tabs';

interface SummarizeAndReadProps {
	children: React.ReactNode;
}

type TranscriptLine = {
	text: string;
	speaker: 'You' | 'Bot';
};

export function Chat(props: SummarizeAndReadProps) {
	const [text, setText] = useState<string>('');
	const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
	const [inProgress, setInProgress] = useState<boolean>(false);
	const [chatBotResponse, setChatBotResponse] = useState<TranscriptLine | null>(null);
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const submit = async (e) => {
		e.preventDefault();
		const userId = getUserId();
		logsnag.publish({
			channel: 'client',
			notify: true,
			event: 'Chat',
			description: `User entered: ${text}`,
			tags: {
				user: userId,
			},
		});

		if (inputRef.current) {
			inputRef.current.setSelectionRange(0, inputRef.current.value.length);
		}
		setTranscript((transcript) => [
			...transcript,
			...(chatBotResponse ? [chatBotResponse] : []),
			{ speaker: `You`, text },
		]);
		setInProgress(true);
		setChatBotResponse({ text: '', speaker: 'Bot' });
		pipelines.chat.vercel.invokeStream(
			{ text },
			(res) => {
				setInProgress(false);
				setChatBotResponse((botResponse) => ({
					text: (botResponse ? botResponse.text : '') + res,
					speaker: 'Bot',
				}));
				scrollToBottom();
			},
			{ userId }
		);
	};

	useEffect(() => {
		scrollToBottom();
	}, [transcript]);

	function scrollToBottom() {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTo({
				behavior: 'smooth',
				top: chatContainerRef.current.scrollHeight,
			});
		}
	}

	return (
		<div className="flex flex-col pt-8 space-y-8 md:space-y-0 md:space-x-8 md:flex-row">
			<div className="flex-1 md:w-1/2 md:h-[32rem] my-14">
				<form onSubmit={submit} className="flex flex-col flex-1 space-y-4">
					<div
						ref={chatContainerRef}
						className="flex flex-col p-2 space-y-1 overflow-auto border rounded-lg border-accent h-96"
					>
						{transcript.map((transcriptLine, index) => (
							<TranscriptLineView key={index} transcriptLine={transcriptLine} />
						))}
						{chatBotResponse ? <TranscriptLineView transcriptLine={chatBotResponse} /> : null}
						<div id="anchor"></div>
					</div>
					<div className="w-full form-control">
						<div className="w-full input-group">
							<input
								ref={inputRef}
								type="input"
								placeholder="Enter some text here"
								className="w-full input input-bordered"
								value={text}
								onChange={(e) => setText(e.currentTarget.value)}
							/>
							<button type="submit" className={`btn btn-square ${inProgress ? 'loading' : ''}`}>
								{inProgress ? '' : 'GO'}
							</button>
						</div>
					</div>
				</form>
			</div>
			<div className="flex-1 md:w-1/2">
				<Tabs
					className="h-[500px]"
					tabs={[
						{
							label: 'Pipeline',
							content: (
								<div className="flex flex-col flex-1 space-y-2">
									<ChatPipelineView isActive={inProgress} pipeline={pipelines.chat} />
									<div className="text-xs text-gray-400">
										* Slight issue with visualizing streaming nodes.
									</div>
								</div>
							),
						},
						{
							label: 'Code',
							content: props.children,
						},
					]}
				/>
			</div>
		</div>
	);
}

function TranscriptLineView(props: { transcriptLine: TranscriptLine }) {
	const speaker = props.transcriptLine.speaker;
	return (
		<div>
			<span className={speaker === 'You' ? 'text-secondary' : 'text-primary'}>{speaker}: </span>
			<span>{props.transcriptLine.text}</span>
		</div>
	);
}

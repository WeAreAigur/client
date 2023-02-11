import { Equalizer } from './Equalizer/Equalizer';

export interface VoiceRecorderProps {
	toggleRecording: () => void;
	isRecording: boolean;
}

export function VoiceRecorder(props: VoiceRecorderProps) {
	return (
		<button
			className={`btn btn-wide ${props.isRecording ? 'btn-accent' : 'btn-primary'}`}
			onClick={props.toggleRecording}
		>
			{props.isRecording ? (
				<span className="flex gap-4">
					Stop Recording <Equalizer />
				</span>
			) : (
				<span>Start Recording</span>
			)}
		</button>
	);
}

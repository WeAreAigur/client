'use client';
import { useEffect, useState } from 'react';

export interface PlayAudioProps {
	audioUrl: string | null;
}

export function PlayAudio(props: PlayAudioProps) {
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

	useEffect(() => {
		if (props.audioUrl) {
			fetch(props.audioUrl)
				.then((result) => result.blob())
				.then((blob) => {
					const url = URL.createObjectURL(blob);
					const audio = new Audio(url);
					setAudio(audio);
				});
		}
	}, [props.audioUrl]);

	const play = () => audio?.play();
	return (
		<button
			className={`btn btn-secondary btn-lg flex-1 ${!audio ? 'btn-disabled' : ''}`}
			onClick={play}
		>
			Play
		</button>
	);
}

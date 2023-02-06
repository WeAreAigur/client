import { useState } from 'react';
import { sdPipeline } from '#/pipelines/sd';

import { useRecord } from '../hooks/useRecord';

export default function Web() {
	const { toggleRecording, result, isRecording } = useRecord();
	const [image, setImage] = useState<string | null>(null);

	const generate = () => {
		sdPipeline.invokeRemote('/api/sd', { prompt: 'a computer' }).then((data) => {
			setImage(data.url);
		});
	};

	const generate2 = () => {
		sdPipeline.invoke({ prompt: 'a chair' }).then((data) => setImage(data.url));
	};

	return (
		<div>
			<h1>Web</h1>
			<button onClick={generate}>Generate1</button>
			<button onClick={generate2}>Generate2</button>
			{image ? <img src={image} /> : <div>no image</div>}
		</div>
	);
}

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { pipelines } from '#/pipelines/pipelines';

import { ImageType, ImageUpload } from './ImageUpload';
import { ImageToPoemPipelineView } from './ImageToPoemPipelineView';

interface ImageToPoemProps {}

export function ImageToPoem(props: ImageToPoemProps) {
	const [image, setImage] = useState<ImageType | null>(null);
	const [inProgress, setInProgress] = useState<boolean>(false);
	const [poem, setPoem] = useState<string>('');

	useEffect(() => {
		if (image) {
			setInProgress(true);
			setPoem('');
			pipelines.imageToPoemStream.vercel.invokeStream({ image: image.base64 }, (text) => {
				setPoem((prev) => prev + text);
				setInProgress(false);
			});
		}
	}, [image]);

	return (
		<div className="flex flex-col pt-8 space-y-8 md:space-y-0 md:space-x-8 md:flex-row">
			<div className="flex flex-col items-center flex-1 space-y-4 md:w-1/2">
				<ImageUpload onSelect={setImage} />
				<div className="relative w-40 h-40 overflow-hidden rounded-lg">
					{image ? (
						<Image src={`data:image/png;base64,${image.base64}`} fill alt="Uploaded Image" />
					) : (
						<div className="flex items-center justify-center w-full h-full border rounded-lg border-accent">
							Upload an Image
						</div>
					)}
				</div>
				{poem ? (
					<pre className="text-sm">{poem}</pre>
				) : (
					<div>{inProgress ? 'Generating poem...' : 'No poem yet :('}</div>
				)}
			</div>
			<div className="flex-1 md:w-1/2">
				<ImageToPoemPipelineView isActive={inProgress} pipeline={pipelines.imageToPoemStream} />
			</div>
		</div>
	);
}

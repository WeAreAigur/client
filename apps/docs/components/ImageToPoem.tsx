import { useEffect, useState } from 'react';
import Image from 'next/image';

import { ImageType, ImageUpload } from './ImageUpload';

// jokeGptPipeline.onProgress((node, type) => {
// 	console.log('progress', node, type);
// });

interface ImageToPoemProps {}

export function ImageToPoem(props: ImageToPoemProps) {
	const [image, setImage] = useState<ImageType | null>(null);
	const [inProgress, setInProgress] = useState<boolean>(false);
	const [poem, setPoem] = useState<string>('');

	useEffect(() => {
		if (image) {
			setInProgress(true);
			import('#/pipelines/pipelines')
				.then((mod) => mod.pipelines)
				.then(({ imageToPoemStream }) => {
					imageToPoemStream.vercel.invokeStream({ image: image.base64 }, (res) => {
						setPoem((prev) => prev + res);
						setInProgress(false);
					});
				});
		}
	}, [image]);

	return (
		<div className="flex flex-col items-center py-6 space-y-4">
			<ImageUpload onSelect={setImage} />
			<div className="relative w-32 h-32 overflow-hidden rounded-lg aspect-auto">
				{image ? (
					<Image src={`data:image/png;base64,${image.base64}`} fill alt="Uploaded Image" />
				) : null}
			</div>
			{poem ? <pre className="text-lg">{poem}</pre> : <div>No poem yet :(</div>}
		</div>
	);
}

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { logsnag } from '#/services/logsnag';
import { pipelines } from '#/pipelines/pipelines';

import { ImageUpload } from './ImageUpload';
import { ImageToPoemPipelineView } from './ImageToPoemPipelineView';
import { Tabs } from '../Tabs';

interface ImageToPoemProps {
	children: React.ReactNode;
}

export function ImageToPoem(props: ImageToPoemProps) {
	const [image, setImage] = useState<string | null>(null);
	const [inProgress, setInProgress] = useState<boolean>(false);
	const [poem, setPoem] = useState<string>('');

	useEffect(() => {
		if (image) {
			invokePipeline(image);
		}
	}, [image]);

	function invokePipeline(image: string) {
		logsnag.publish({
			channel: 'client',
			notify: true,
			event: 'ImageToPoem',
		});
		setInProgress(true);
		setPoem('');
		pipelines.imageToPoemStream.vercel.invokeStream({ image }, (text) => {
			setPoem((prev) => prev + text);
			setInProgress(false);
		});
	}

	return (
		<div className="flex flex-col pt-8 space-y-8 md:space-y-0 md:space-x-8 md:flex-row">
			<div className="flex flex-col items-center flex-1 space-y-4 md:w-1/2">
				<ImageUpload onSelect={(image) => setImage(image.base64)} />
				<div className="relative w-40 h-40 overflow-hidden rounded-lg">
					{image ? (
						<Image src={`data:image/png;base64,${image}`} fill alt="Uploaded Image" />
					) : (
						<div className="flex items-center justify-center w-full h-full border rounded-lg border-accent">
							Upload an Image
						</div>
					)}
				</div>
				<div className="space-y-4">
					<div>Use one of these examples if you&apos;re too lazy:</div>
					<div className="flex flex-wrap gap-2">
						{['sportsCar', 'scenery', 'dog'].map((key) => (
							<button
								key={key}
								className="btn btn-sm btn-primary"
								onClick={() => {
									setImage(null);
									import('./premadeImages').then((mod) => {
										setImage(mod[key]);
									});
								}}
							>
								{key}
							</button>
						))}
					</div>
				</div>
				{poem ? (
					<pre className="text-sm">{poem}</pre>
				) : (
					<div>{inProgress ? 'Generating poem...' : 'No poem yet :('}</div>
				)}
			</div>
			<div className="flex-1 md:w-1/2">
				<Tabs
					className="h-[520px]"
					tabs={[
						{
							label: 'Pipeline',
							content: (
								<div className="flex flex-col flex-1 space-y-2">
									<ImageToPoemPipelineView
										isActive={inProgress}
										pipeline={pipelines.imageToPoemStream}
									/>
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

import { useState } from 'react';
import Image from 'next/image';

// jokeGptPipeline.onProgress((node, type) => {
// 	console.log('progress', node, type);
// });

interface SimplePromptToImageProps {}

export function SimplePromptToImage(props: SimplePromptToImageProps) {
	const [prompt, setPrompt] = useState<string>('');
	const [inProgress, setInProgress] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState<string>('');
	const [keywords, setKeywords] = useState<string>('');

	const submit = async (e: any) => {
		e.preventDefault();
		setInProgress(true);
		const { simplePromptToImage } = await import('#/pipelines/pipelines').then(
			(mod) => mod.pipelines
		);
		const { url, keywords } = await simplePromptToImage.vercel.invoke({ prompt });
		setImageUrl(url);
		setKeywords(keywords.trim());
		setInProgress(false);
	};

	return (
		<form onSubmit={submit} className="flex flex-col items-center py-6 space-y-4">
			<div className="form-control">
				<div className="input-group">
					<input
						type="text"
						placeholder="Simple Prompt"
						className="input input-bordered"
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
					/>
					<button className={`btn btn-square ${inProgress ? 'loading' : ''}`} type="submit">
						{inProgress ? '' : 'GO'}
					</button>
				</div>
			</div>
			{inProgress ? (
				'Enhancing prompt and creating image...'
			) : imageUrl ? (
				<div>
					<div className="text-lg">
						<Image width={512} height={512} src={imageUrl} alt={prompt} />
					</div>
					<div className="text-sm">({keywords})</div>
				</div>
			) : (
				''
			)}
		</form>
	);
}

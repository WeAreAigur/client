import { useState } from 'react';
import { jokeGptPipeline } from '#/pipelines/jokegpt';

interface JokeFormProps {}

export function JokeForm(props: JokeFormProps) {
	const [subject, setSubject] = useState<string>('');
	const [inProgress, setInProgress] = useState<boolean>(false);
	const [joke, setJoke] = useState<string | null>(null);

	const submit = (e: any) => {
		e.preventDefault();
		setInProgress(true);
		jokeGptPipeline.vercel.invoke({ subject }).then((data) => {
			setJoke(data.text);
			setInProgress(false);
		});
	};

	return (
		<form
			onSubmit={submit}
			className="flex flex-col items-center py-6 space-y-4 md:space-x-4 md:space-y-0 md:flex-row"
		>
			<div className="form-control">
				<div className="input-group">
					<input
						type="text"
						placeholder="Subject"
						className="input input-bordered"
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
					/>
					<button className={`btn btn-square ${inProgress ? 'loading' : ''}`} type="submit">
						GO
					</button>
				</div>
			</div>
			{joke ? (
				<div>
					<div className="text-lg">{joke}</div>
					<div className="text-sm">(Hey, I didnt say it would be funny!)</div>{' '}
				</div>
			) : (
				<div>No joke yet :(</div>
			)}
		</form>
	);
}

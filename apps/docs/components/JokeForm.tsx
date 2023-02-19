import { jokeGptPipeline } from '#/pipelines/jokegpt';
import { logsnag } from '#/services/logsnag';
import { useState } from 'react';

interface JokeFormProps {}

export function JokeForm(props: JokeFormProps) {
	const [subject, setSubject] = useState<string>('');
	const [inProgress, setInProgress] = useState<boolean>(false);
	const [joke, setJoke] = useState<string>('');

	const submit = async (e: any) => {
		logsnag.publish({
			channel: 'client',
			notify: true,
			event: 'Joke',
		});
		e.preventDefault();
		setInProgress(true);
		const { joke } = await jokeGptPipeline.vercel.invoke({ subject });
		setJoke(joke);
		setInProgress(false);
	};

	return (
		<form onSubmit={submit} className="flex flex-col items-center py-6 space-y-4">
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
						{inProgress ? '' : 'GO'}
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

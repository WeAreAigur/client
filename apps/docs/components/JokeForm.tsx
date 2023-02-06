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
		jokeGptPipeline.invokeRemote('/api/joke', { subject }).then((data) => {
			setJoke(data.text);
			setInProgress(false);
		});
	};

	return (
		<div className="flex flex-col">
			<form onSubmit={submit}>
				<input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
				<button type="submit">Generate</button>
				<div>{inProgress ? 'Generating...' : ''}</div>
				{joke ? (
					<div>
						<div>{joke}</div>
						<div>(Hey, I didnt say it would be funny!)</div>{' '}
					</div>
				) : (
					<div>No joke yet :(</div>
				)}
			</form>
		</div>
	);
}

import { useState } from 'react';
import { jokeGptPipeline } from '#/pipelines/jokegpt';

interface JokeFormProps {}

export function JokeForm(props: JokeFormProps) {
	const [subject, setSubject] = useState<string>('');
	const [joke, setJoke] = useState<string | null>('No joke yet :(');

	const submit = (e: any) => {
		e.preventDefault();
		console.log(subject);
		jokeGptPipeline.invokeRemote('/api/joke', { subject }).then((data) => setJoke(data.text));
	};

	return (
		<div className="flex flex-col">
			<form onSubmit={submit}>
				<input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
				<button type="submit">Generate</button>
			</form>
		</div>
	);
}

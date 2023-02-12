import { useState } from 'react';
import { pipelines } from '#/pipelines/pipelines';

import { PlayAudio } from './PlayAudio';
import { SummarizeAndReadPipelineView } from './ImageToPoemPipelineView';

interface SummarizeAndReadProps {}

const examples = {
	Boston:
		'Boston (US: /ˈbɔːstən/),[7] officially the City of Boston, is the state capital and most populous city of the Commonwealth of Massachusetts and the cultural and financial center of the New England region of the United States. It is the 24th-most populous city in the country.[8] The city boundaries encompass an area of about 48.4 sq mi (125 km2)[9] and a population of 675,647 as of 2020.[3] The city is the economic and cultural anchor of a substantially larger metropolitan area known as Greater Boston, a metropolitan statistical area (MSA) home to a census-estimated 4.8 million people in 2016 and ranking as the tenth-largest MSA in the country.[10] A broader combined statistical area (CSA), generally corresponding to the commuting area[11] and including Providence, Rhode Island, is home to approximately 8.2 million people, making it the sixth most populous in the United States.[12]',
	'Quantum Mechanics':
		'Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles.[2]: 1.1  It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science. Classical physics, the collection of theories that existed before the advent of quantum mechanics, describes many aspects of nature at an ordinary (macroscopic) scale, but is not sufficient for describing them at small (atomic and subatomic) scales. Most theories in classical physics can be derived from quantum mechanics as an approximation valid at large (macroscopic) scale.[3]',
};

export function SummarizeAndRead(props: SummarizeAndReadProps) {
	const [text, setText] = useState<string>('');
	const [inProgress, setInProgress] = useState<boolean>(false);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [summary, setSummary] = useState<string | null>(null);

	const summarize = async () => {
		setInProgress(true);
		setAudioUrl(null);
		setSummary(null);
		const { url, summary } = await pipelines.summarizeAndRead.vercel.invoke({ text });
		setAudioUrl(url);
		setSummary(summary);
		setInProgress(false);
	};

	return (
		<div className="flex flex-col pt-8 space-y-8 md:space-y-0 md:space-x-8 md:flex-row">
			<div className="flex flex-col flex-1 space-y-4 md:w-1/2 md:h-[32rem]">
				<textarea
					className="flex-1 w-full textarea textarea-bordered"
					value={text}
					onChange={(e) => setText(e.currentTarget.value)}
				></textarea>
				<div className="space-y-4">
					<div>Use one of these examples if you&apos;re too lazy</div>
					<div className="flex flex-wrap space-x-2">
						{Object.entries(examples).map(([key, example]) => (
							<button
								key={example}
								className="btn btn-sm btn-primary"
								onClick={() => setText(example)}
							>
								{key}
							</button>
						))}
					</div>
				</div>
				<div>{summary}</div>
				<div className="flex justify-around space-x-8">
					<button
						className={`btn btn-primary btn-lg flex-1 ${inProgress ? 'loading' : ''}`}
						onClick={summarize}
					>
						{inProgress ? '' : 'GO'}
					</button>
					<PlayAudio audioUrl={audioUrl} />
				</div>
			</div>
			<div className="flex-1 md:w-1/2">
				<SummarizeAndReadPipelineView isActive={inProgress} pipeline={pipelines.summarizeAndRead} />
			</div>
		</div>
	);
}

import { useState } from 'react';
import { pipelines } from '#/pipelines/pipelines';

import { SummarizeAndReadPipelineView } from './SummarizeAndReadPipelineView';
import { PlayAudio } from './PlayAudio';

interface SummarizeAndReadProps {}

const examples = {
	Boston:
		'Boston (US: /ˈbɔːstən/),[7] officially the City of Boston, is the state capital and most populous city of the Commonwealth of Massachusetts and the cultural and financial center of the New England region of the United States. It is the 24th-most populous city in the country.[8] The city boundaries encompass an area of about 48.4 sq mi (125 km2)[9] and a population of 675,647 as of 2020.[3] The city is the economic and cultural anchor of a substantially larger metropolitan area known as Greater Boston, a metropolitan statistical area (MSA) home to a census-estimated 4.8 million people in 2016 and ranking as the tenth-largest MSA in the country.[10] A broader combined statistical area (CSA), generally corresponding to the commuting area[11] and including Providence, Rhode Island, is home to approximately 8.2 million people, making it the sixth most populous in the United States.[12]',
	'Quantum Mechanics':
		'Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles.[2]: 1.1  It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science. Classical physics, the collection of theories that existed before the advent of quantum mechanics, describes many aspects of nature at an ordinary (macroscopic) scale, but is not sufficient for describing them at small (atomic and subatomic) scales. Most theories in classical physics can be derived from quantum mechanics as an approximation valid at large (macroscopic) scale.[3]',
	GAN: `A generative adversarial network (GAN) is a class of machine learning frameworks designed by Ian Goodfellow and his colleagues in June 2014.[1] Two neural networks contest with each other in the form of a zero-sum game, where one agent's gain is another agent's loss.
		Given a training set, this technique learns to generate new data with the same statistics as the training set. For example, a GAN trained on photographs can generate new photographs that look at least superficially authentic to human observers, having many realistic characteristics. Though originally proposed as a form of generative model for unsupervised learning, GANs have also proved useful for semi-supervised learning,[2] fully supervised learning,[3] and reinforcement learning.[4]
		The core idea of a GAN is based on the "indirect" training through the discriminator, another neural network that can tell how "realistic" the input seems, which itself is also being updated dynamically.[5] This means that the generator is not trained to minimize the distance to a specific image, but rather to fool the discriminator. This enables the model to learn in an unsupervised manner.
		GANs are similar to mimicry in evolutionary biology, with an evolutionary arms race between both networks.`,
	Greenland: `Greenland (Greenlandic: Kalaallit Nunaat, pronounced [kalaːɬit nʉnaːt]; Danish: Grønland, pronounced [ˈkʁɶnˌlænˀ]) is an island country in North America that is part of the Kingdom of Denmark.[13] It is located between the Arctic and Atlantic oceans, east of the Canadian Arctic Archipelago. Greenland is the world's largest island.[d] It is one of three constituent countries that form the Kingdom of Denmark, along with Denmark and the Faroe Islands; the citizens of these countries are all citizens of Denmark and the European Union.[15] Greenland's capital is Nuuk.[15]
		Though a part of the continent of North America, Greenland has been politically and culturally associated with Europe (specifically Norway and Denmark, the colonial powers) for more than a millennium, beginning in 986.[16] Greenland has been inhabited at intervals over at least the last 4,500 years by Arctic peoples whose forebears migrated there from what is now Canada.[17][18] Norsemen settled the uninhabited southern part of Greenland beginning in the 10th century, having previously settled Iceland. Inuit arrived in the 13th century. Though under continuous influence of Norway and Norwegians, Greenland was not formally under the Norwegian crown until 1261. The Norse colonies disappeared in the late 15th century, after Norway was hit by the Black Death and entered a severe decline.`,
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
					placeholder="Enter some text here"
					className="flex-1 w-full textarea textarea-bordered"
					value={text}
					onChange={(e) => setText(e.currentTarget.value)}
				></textarea>
				<div className="space-y-4">
					<div>Use one of these examples if you&apos;re too lazy:</div>
					<div className="flex flex-wrap gap-2">
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
				<div className="italic">{summary}</div>
				<div className="flex justify-around space-x-8">
					<button
						className={`btn btn-primary btn-lg flex-1 ${inProgress ? 'loading' : ''}`}
						onClick={summarize}
					>
						{inProgress ? '' : 'GO'}
					</button>
					<PlayAudio inProgress={inProgress} audioUrl={audioUrl} />
				</div>
			</div>
			<div className="flex-1 md:w-1/2">
				<SummarizeAndReadPipelineView isActive={inProgress} pipeline={pipelines.summarizeAndRead} />
			</div>
		</div>
	);
}

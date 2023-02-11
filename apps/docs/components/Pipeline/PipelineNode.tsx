import { Handle, Position } from 'reactflow';
import { useState } from 'react';

// import { useAigur } from '../services/Aigur';

export interface PipelineNodeProps {
	id: string;
	data: {
		type: string;
		label: string;
		definitionLabel: string;
		handles: {
			type: 'target' | 'source';
			position: Position;
		}[];
	};
}

function upperFirst(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function PipelineNode(props: PipelineNodeProps) {
	const [status, setStatus] = useState<'idle' | 'inProgress' | 'done'>('idle');
	const [output, setOutput] = useState<any>(null);
	// const aigur = useAigur();

	// useEffect(() => {
	// 	return aigur.onPipelineProgress((progress) => {
	// 		if (progress.nodeId.toString() === props.id) {
	// 			if (progress.type === 'start') {
	// 				setStatus('inProgress');
	// 			} else if (progress.type === 'finish') {
	// 				setStatus('done');
	// 				setOutput(progress.output);
	// 			}
	// 		}
	// 	});
	// }, [aigur, props.id]);

	const borderColor = props.data.type === 'provider' ? 'border-blue-600' : 'border-pink-600';
	const ringColor = props.data.type === 'provider' ? 'ring-blue-900' : 'ring-pink-900';

	const Status = () => {
		if (status === 'inProgress') {
			return <span>🔄</span>;
		}
		if (status === 'done') {
			return <span>✅</span>;
		}
		return null;
	};

	return (
		<div
			className={
				status === 'done' && !!output ? 'tooltip tooltip-right tooltip-secondary tooltip-open' : ''
			}
			data-tip={output ? ellipsis(JSON.stringify(output, null, 2)) : ''}
		>
			<div
				className={`px-4 py-2 rounded-lg bg-stone-800 border ring-2 ring-offset-2 ring-offset-zinc-900 min-h-[9rem] min-w-[14rem] w-[15rem] ${borderColor} ${ringColor}`}
			>
				<div className="flex flex-col space-y-2 text-left">
					<div className="text-xs text-stone-500">
						{upperFirst(props.data.type)}
						{props.data.type === 'provider' ? ` - ${props.data.definitionLabel}` : ''}
					</div>
					<div className="text-2xl font-bold text-stone-100">{props.data.label}</div>
				</div>
				<div className="absolute right-2 bottom-2">
					<Status />
				</div>
				{props.data.handles?.map((handle, i) => (
					<Handle
						key={`${handle.position}-${i}`}
						type={handle.type}
						position={handle.position}
						className="h-2.5 w-2.5 bg-secondary"
						id={`${props.id}-${handle.position}`}
					/>
				))}
			</div>
		</div>
	);
}

function ellipsis(str: string, length: number = 100) {
	if (str.length > length) {
		return str.substring(0, length) + '...';
	}
	return str;
}

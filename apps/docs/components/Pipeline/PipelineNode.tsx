import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';

import type { Pipeline } from '@aigur/client';

export interface PipelineNodeProps {
	id: string;
	data: {
		index: number;
		type: string;
		label: string;
		definitionLabel: string;
		handles: {
			type: 'target' | 'source';
			position: Position;
		}[];
		pipeline: Pipeline<any, any>;
	};
}

function upperFirst(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function PipelineNode(props: PipelineNodeProps) {
	const [status, setStatus] = useState<'idle' | 'inProgress' | 'done'>('idle');

	useEffect(() => {
		props.data.pipeline.onStart(() => {
			setStatus('idle');
		});
		props.data.pipeline.onProgress(({ node, type, index }) => {
			if (index === props.data.index) {
				if (type === 'node:start') {
					setStatus('inProgress');
				} else if (type === 'node:finish') {
					setStatus('done');
				}
			}
		});
	}, [props.data.pipeline, props.data.index]);

	const borderColor = props.data.type === 'provider' ? 'border-blue-600' : 'border-pink-600';
	const ringColor = props.data.type === 'provider' ? 'ring-blue-900' : 'ring-pink-900';

	const Status = () => {
		if (status === 'inProgress') {
			return <div className="badge badge-warning">In Progress</div>;
		}
		if (status === 'done') {
			return <div className="badge badge-success">Done</div>;
		}
		return null;
	};

	return (
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
					id={`${props.data.index}-${handle.position}`}
				/>
			))}
		</div>
	);
}

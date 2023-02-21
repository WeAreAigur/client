import { useEffect, useRef, useState } from 'react';
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
	const lastProgressEventIdx = useRef<number>(-1);

	useEffect(() => {
		const unsubOnFinish = props.data.pipeline.onFinish((event) => {
			console.log(`${Date.now()} - Pipeline finishing`, event.pipelineId, event);
			setTimeout(() => setStatus('idle'), 2500);
		});
		const unsubOnStart = props.data.pipeline.onStart((event) => {
			console.log(`${Date.now()} - Pipeline starting`, event.pipelineId, event);
		});
		const unsubOnProgress = props.data.pipeline.onProgress((event) => {
			if (event.eventIndex < lastProgressEventIdx.current) {
				return;
			}
			if (event.data?.index === props.data.index) {
				lastProgressEventIdx.current = event.eventIndex;
				console.log(`${Date.now()} - event`, event.data?.index, event);
				if (event.type === 'node:start') {
					console.log(`${Date.now()} - setting status to inProgress`, event.data?.index);
					setStatus((status) => (status === 'idle' ? 'inProgress' : status));
				} else if (event.type === 'node:finish') {
					console.log(`${Date.now()} - setting status to done`, event.data?.index);
					setStatus('done');
				}
			}
		});
		return () => {
			unsubOnFinish();
			unsubOnStart();
			unsubOnProgress();
		};
	}, [props.data.pipeline, props.data.index, status]);

	console.log(`***rendering node ${props.data.label}, ${props.data.index}, ${status}`);

	const borderColor = props.data.type === 'provider' ? 'border-blue-600' : 'border-pink-600';
	const ringColor = props.data.type === 'provider' ? 'ring-blue-900' : 'ring-pink-900';

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
				{/* Lovely double triple ternary 💪🏻 */}
				<div
					className={`transition-all duration-300 badge ${
						status === 'idle'
							? 'badge-outline'
							: status === 'inProgress'
							? 'badge-warning'
							: 'badge-success'
					}`}
				>
					{status === 'idle' ? 'Idle' : status === 'inProgress' ? 'In Progress' : 'Done'}
				</div>
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

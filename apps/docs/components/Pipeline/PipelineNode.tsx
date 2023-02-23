import { Handle, Position } from 'reactflow';
import { useEffect, useRef, useState } from 'react';

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
		pipeline: Pipeline<any, any, any>;
	};
}

function upperFirst(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

let resetTimeout;
const PIPELINE_RESET_TIME = 1_500;
const PIPELINE_RESET_ON_START_TIME = 10_000;
export function PipelineNode(props: PipelineNodeProps) {
	const [status, setStatus] = useState<'idle' | 'inProgress' | 'done'>('idle');
	const lastProgressEventIdx = useRef<number>(-1);

	useEffect(() => {
		const unsubOnStart = props.data.pipeline.onStart(() => {
			if (resetTimeout) {
				clearTimeout(resetTimeout);
			}
			resetTimeout = setTimeout(() => setStatus('idle'), PIPELINE_RESET_ON_START_TIME);
		});
		const unsubOnFinish = props.data.pipeline.onFinish((event) => {
			// dont accept anymore events
			lastProgressEventIdx.current = event.eventIndex;
			setStatus('done');
			setTimeout(() => {
				setStatus('idle');
				lastProgressEventIdx.current = 0;
			}, PIPELINE_RESET_TIME);
		});
		const unsubOnProgress = props.data.pipeline.onProgress((event) => {
			if (event.data?.index === props.data.index) {
				if (event.eventIndex < lastProgressEventIdx.current) {
					return;
				}
				lastProgressEventIdx.current = event.eventIndex;
				if (event.type === 'node:start') {
					setStatus((status) => (status === 'idle' ? 'inProgress' : status));
				} else if (event.type === 'node:finish') {
					setStatus('done');
				}
			}
		});
		return () => {
			unsubOnFinish();
			unsubOnProgress();
			unsubOnStart();
		};
	}, [props.data.pipeline, props.data.index, status]);

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

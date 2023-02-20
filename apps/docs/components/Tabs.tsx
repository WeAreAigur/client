import { ReactNode, useState } from 'react';

export interface Tab {
	label: string;
	content: ReactNode;
}

export interface TabsProps {
	tabs: Tab[];
	compact?: boolean;
	className?: string;
}

export function Tabs(props: TabsProps) {
	const [activeTab, setActiveTab] = useState<number>(0);

	return (
		<div className={`flex flex-col flex-1 h-full space-y-6 ${props.className ?? ''}`}>
			<div className="justify-center tabs">
				{props.tabs.map((tab, index) => (
					<a
						key={tab.label}
						className={`tab tab-bordered ${index === activeTab ? 'tab-active' : ''}`}
						onClick={() => setActiveTab(index)}
					>
						{tab.label}
					</a>
				))}
			</div>
			{props.tabs[activeTab].content}
		</div>
	);
}

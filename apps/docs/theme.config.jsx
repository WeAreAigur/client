export default {
	logo: (
		<span className="text-lg font-bold">
			<span style={{ color: '#d926aa' }}>AI</span>GUR
		</span>
	),
	project: {
		link: 'https://github.com/weareaigur/client',
	},
	useNextSeoProps() {
		return {
			titleTemplate: '%s – Aigur Client',
		};
	},
};

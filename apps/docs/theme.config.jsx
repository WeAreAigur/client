const siteUrl = `https://client.aigur.dev`;

export default {
	logo: (
		<span className="text-2xl font-bold">
			<span style={{ color: '#d926aa' }}>AI</span>GUR
		</span>
	),
	project: {
		link: 'https://github.com/weareaigur/client',
	},
	docsRepositoryBase: 'https://github.com/weareaigur/client',
	editLink: false,
	feedback: {
		labels: 'documentation',
	},
	footer: {
		text: (
			<span className="text-sm">
				MIT {new Date().getFullYear()} ©{' '}
				<a href={siteUrl} target="_blank">
					Aigur Client
				</a>
				.
			</span>
		),
	},
	faviconGlyph: '📖',

	useNextSeoProps() {
		return {
			titleTemplate: '%s – Aigur Client',
		};
	},
};

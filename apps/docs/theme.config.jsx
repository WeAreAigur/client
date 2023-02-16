const siteUrl = `https://client.aigur.dev`;

export default {
	logo: (
		<span className="text-xl font-bold">
			<span style={{ color: '#d926aa' }}>AI</span>
			<span>GUR</span>
			<span className="text-sm text-accent">client</span>
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
	head: (
		<>
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta property="og:title" content="Aigur Client" />
			<meta property="og:description" content="Compose and Invoke Generative AI Pipelines" />
		</>
	),

	useNextSeoProps() {
		return {
			titleTemplate: '%s – Aigur Client',
		};
	},
};

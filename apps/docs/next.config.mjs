import nextra from 'nextra';
import remarkMdxDisableExplicitJsx from 'remark-mdx-disable-explicit-jsx';

import { remarkCodeHike } from '@code-hike/mdx';
import theme from 'shiki/themes/material-theme-palenight.json' assert { type: 'json' };

const withNextra = nextra({
	theme: 'nextra-theme-docs',
	themeConfig: './theme.config.jsx',
	mdxOptions: {
		remarkPlugins: [
			[remarkCodeHike, { theme }],
			[remarkMdxDisableExplicitJsx, { whiteList: ['table', 'thead', 'tbody', 'tr', 'th', 'td'] }],
		],
	},
});

export default withNextra({
	reactStrictMode: true,
	transpilePackages: ['@aigur/client', '@aigur/supabase', '@aigur/validate'],
	images: {
		domains: ['rxbcnsluyhrlazakjohf.supabase.co', 'oaidalleapiprodscus.blob.core.windows.net'],
	},
	async redirects() {
		return [
			{
				source: '/',
				destination: 'https://aigur.dev',
				permanent: false,
			},
		];
	},
});

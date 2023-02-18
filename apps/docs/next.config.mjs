import nextra from 'nextra';
import remarkMdxDisableExplicitJsx from 'remark-mdx-disable-explicit-jsx';
import TerserPlugin from 'terser-webpack-plugin';

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
	webpack: (config, { dev }) => {
		return {
			...config,
			optimization: {
				...config.optimization,
				minimize: !dev,
				minimizer: [
					...(config.optimization.minimizer || []),
					new TerserPlugin({
						terserOptions: {
							compress: {
								evaluate: false,
							},
						},
					}),
				],
			},
		};
	},
});

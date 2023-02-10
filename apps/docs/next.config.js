/** @type {import('next').NextConfig} */
const { remarkCodeHike } = require('@code-hike/mdx');
const theme = require('shiki/themes/material-palenight.json');

const withNextra = require('nextra')({
	theme: 'nextra-theme-docs',
	themeConfig: './theme.config.jsx',
	mdxOptions: {
		remarkPlugins: [[remarkCodeHike, { theme }]],
	},
});

module.exports = withNextra({
	reactStrictMode: true,
	transpilePackages: ['@aigur/client', '@aigur/helpers'],
	images: {
		domains: ['rxbcnsluyhrlazakjohf.supabase.co'],
	},
});

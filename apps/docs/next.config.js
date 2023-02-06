/** @type {import('next').NextConfig} */

const withNextra = require('nextra')({
	theme: 'nextra-theme-docs',
	themeConfig: './theme.config.jsx',
	reactStrictMode: true,
	transpilePackages: ['@aigur/client', '@aigur/helpers'],
});

module.exports = withNextra();

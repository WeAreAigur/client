import '#/styles/globals.css';
import '@code-hike/mdx/dist/index.css';
import 'reactflow/dist/style.css';

import { Analytics } from '@vercel/analytics/react';

import type { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Component {...pageProps} />
			<Analytics />
		</>
	);
}

export default App;

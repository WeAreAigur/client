import { pipelines } from '#/pipelines/pipelines';

import { vercelEdgeFunction } from '@aigur/client';

export default vercelEdgeFunction(pipelines);
export const config = {
	runtime: 'edge',
};

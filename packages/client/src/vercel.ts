// import { Pipeline } from './types';
// import { invokePipeline } from './invokePipeline';

// export function generateVercelFunction(pipeline: Pipeline) {
// 	return async function handler(req: any, res: any) {
// 		const output = await invokePipeline(pipeline, req.body);
// 		res.status(200).json(output);
// 	};
// }

// export function generateVercelEdgeFunction(pipeline: Pipeline) {
// 	return async function handler(req: any, res: any) {
// 		const output = await invokePipeline(pipeline, req.body);
// 		res.status(200).json(output);
// 	};
// }

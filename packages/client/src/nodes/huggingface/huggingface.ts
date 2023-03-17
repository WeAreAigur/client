import { z } from 'zod';

import { HfInference, Options } from '@huggingface/inference';

export function hf<T extends HfInference[keyof HfInference]>(
	cb: (h: HfInference) => T,
	options?: Options
): (
	input: Parameters<ReturnType<typeof cb>>['0'],
	APIKeys: Record<string, string>
) => Promise<ReturnType<T>> {
	return (input: Parameters<ReturnType<typeof cb>>['0'], APIKeys: Record<string, string>) => {
		const hf = new HfInference(APIKeys.huggingface);
		const hfInferenceFunction: any = cb(hf);
		return hfInferenceFunction.call(hf, input as any, options);
	};
}

export const optionsSchema = z
	.object({
		/**
		 * (Default: true) Boolean. If a request 503s and wait_for_model is set to false, the request will be retried with the same parameters but with wait_for_model set to true.
		 */
		retry_on_error: z.boolean().optional().default(true),
		/**
		 * (Default: true). Boolean. There is a cache layer on the inference API to speedup requests we have already seen. Most models can use those results as is as models are deterministic (meaning the results will be the same anyway). However if you use a non deterministic model, you can set this parameter to prevent the caching mechanism from being used resulting in a real new query.
		 */
		use_cache: z.boolean().optional().default(true),
		/**
		 * (Default: false). Boolean to use GPU instead of CPU for inference (requires Startup plan at least).
		 */
		use_gpu: z.boolean().optional(),
		/**
		 * (Default: false) Boolean. If the model is not ready, wait for it instead of receiving 503. It limits the number of requests required to get your inference done. It is advised to only set this flag to true after receiving a 503 error as it will limit hanging in your application to known places.
		 */
		wait_for_model: z.boolean().optional(),
	})
	.optional();

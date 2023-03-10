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
		const hfInferenceFunction = cb(hf);
		return hfInferenceFunction.call(hf, input as any, options);
	};
}

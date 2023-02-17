export const outputNode =
	<InputOutput>(input: InputOutput) =>
	async (): Promise<InputOutput> =>
		input;

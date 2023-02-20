- fix enum in pipelines (cant set string)
- nodes
  - image to image
  - more gpt3 apis

```ts
flow
  .node(blabla, () => ({}))
  .split(
    ({prev}) => prev.text === 'yes'
      ? flow.node(...)
      : null
    ({prev}) => prev.text === 'no'
      ? flow.node(...)
      : null
  )
  .output(() => ...)
```

```ts
export const jokeGptPipeline = aigur.pipeline.create<z.input<typeof inputSchema>, { joke: string }>(
	{
		id: 'jokegpt',
		validateInput: validateInput(inputSchema),
		flow: (flow) =>
			flow
				.node(replaceString, {
					text: flow.input.subject,
					modifier: 'tell me a joke about $(text)$',
				})
				.node(gpt3Prediction, {
					prompt: flow.prev.text,
				})
				.output({
					joke: flow.prev.text,
				}),
	}
);
```

Split can be typed in a similar fashion like [output](https://github.com/WeAreAigur/client/blob/main/packages/client/src/builder.ts#L60-L68) but as a variadic function.

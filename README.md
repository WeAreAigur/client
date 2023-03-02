# Aigur Client

A **free** and **opensource** (MIT) client to compose and invoke fully typed Generative AI pipelines.

Check out the documentation at https://client.aigur.dev

## Simple Example

This **simple** pipeline accepts a `subject` and returns a `joke` about that subject.

```ts
import {
  createClient,
  replaceString,
  gpt3Prediction
} from '@aigur/client';

export const aigur = createClient({
  apiKeys: {
    openai: process.env.OPENAI_KEY!,
  },
});

export const jokeGptPipeline = aigur.pipeline
  .create<{ subject: string }, { joke: string }>({
    id: 'jokegpt',
     flow: (flow) =>
       flow
         .node(replaceString, ({ input }) => ({
           text: input.subject,
           modifier: 'tell me a joke about $(text)$',
         }))
         .node(gpt3Prediction, ({ prev }) => ({
           prompt: prev.text,
         }))
         .output(({ prev }) => ({
           joke: prev.text,
         })
  });

const { joke } = await jokeGptPipeline.invoke({
  subject: 'a car'
});
```

## Create an Image with Your Voice

Check out this next example in the docs site.

![aigur-client](https://user-images.githubusercontent.com/1783303/220385376-a3ca0e0c-b176-4a6c-8c4f-7d215d02c532.gif)

- "attach" supabase upload to builder node tree (results.upload.supabase)
- support nested objects in input:
  text_prompt: [
  {
  text: '$context.input.prompt$',
  }
  ]

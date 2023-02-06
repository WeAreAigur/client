- change supabase class to function
- "attach" supabase upload to builder node tree (results.upload.supabase)
- change @aigur/supabase to @aigur/helpers
- support nested objects in input:
  text_prompt: [
  {
  text: '$context.input.prompt$',
  }
  ]

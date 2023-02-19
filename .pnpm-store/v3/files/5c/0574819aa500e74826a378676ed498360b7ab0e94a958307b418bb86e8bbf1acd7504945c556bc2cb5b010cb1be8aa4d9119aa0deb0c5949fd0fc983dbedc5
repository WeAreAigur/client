/**
 * Plugin to transform `<span class=math-inline>` and `<div class=math-display>`
 * with KaTeX.
 *
 * @type {import('unified').Plugin<[Options?]|void[], Root>}
 */
export default function rehypeKatex(
  options: void | katex.KatexOptions | undefined
):
  | void
  | import('unified').Transformer<import('hast').Root, import('hast').Root>
export type Root = import('hast').Root
export type Options = import('katex').KatexOptions
import katex from 'katex'

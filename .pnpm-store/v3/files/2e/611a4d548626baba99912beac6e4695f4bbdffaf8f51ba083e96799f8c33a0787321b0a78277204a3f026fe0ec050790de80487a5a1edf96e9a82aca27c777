import type { Options as Options_2 } from 'compute-scroll-into-view'
import type { ScrollAction } from 'compute-scroll-into-view'

/** @public */
export declare interface CustomBehaviorOptions<T = unknown> extends Options_2 {
  behavior: CustomScrollBehaviorCallback<T>
}

/** @public */
export declare type CustomScrollBehaviorCallback<T = unknown> = (
  actions: ScrollAction[]
) => T

/** @public */
export declare type Options<T = unknown> =
  | StandardBehaviorOptions
  | CustomBehaviorOptions<T>

/** @public */
declare function scrollIntoView<T>(
  target: Element,
  options: CustomBehaviorOptions<T>
): T

/** @public */
declare function scrollIntoView(
  target: Element,
  options?: StandardBehaviorOptions | boolean
): void
export default scrollIntoView

/** @public */
export declare interface StandardBehaviorOptions extends Options_2 {
  /**
   * @defaultValue 'auto
   */
  behavior?: ScrollBehavior
}

export {}

import type { Plugin } from "unified";
import type { Root } from "hast";

export interface Options {
  whiteList?: string[];
  blackList?: string[];
}

/*
 * Remark plugin to reenable styling of html tags with 'components' prop.
 */

declare const remarkMdxDisableExplicitJsx: Plugin<
  [Options?] | void[],
  Root,
  Root
>;

export default remarkMdxDisableExplicitJsx;

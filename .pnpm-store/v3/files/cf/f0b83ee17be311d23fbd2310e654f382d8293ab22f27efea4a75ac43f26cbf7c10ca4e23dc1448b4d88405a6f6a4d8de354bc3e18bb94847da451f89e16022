// src/remote.ts
import { compileMdx } from "./compile.mjs";
import { remarkLinkRewrite } from "./mdx-plugins/index.mjs";
import { truthy } from "./utils.mjs";
var buildDynamicMDX = async (content, {
  remarkLinkRewriteOptions,
  ...loaderOptions
} = {}) => {
  const { result, headings, frontMatter, title } = await compileMdx(content, {
    ...loaderOptions,
    mdxOptions: {
      remarkPlugins: [
        remarkLinkRewriteOptions && [
          remarkLinkRewrite,
          remarkLinkRewriteOptions
        ]
      ].filter(truthy)
    }
  });
  return {
    __nextra_dynamic_mdx: result,
    __nextra_dynamic_opts: JSON.stringify({
      headings,
      frontMatter,
      title: frontMatter.title || title
    })
  };
};
var buildDynamicMeta = async () => {
  const resolvePageMap = globalThis.__nextra_resolvePageMap;
  if (resolvePageMap) {
    return {
      __nextra_pageMap: await resolvePageMap()
    };
  }
  return {};
};
export {
  buildDynamicMDX,
  buildDynamicMeta
};

// src/loader.ts
import path from "path";
import slash from "slash";
import { hashFnv32a, pageTitleFromFilename, parseFileName } from "./utils.mjs";
import { compileMdx } from "./compile.mjs";
import { resolvePageMap } from "./page-map.mjs";
import { collectFiles, collectMdx } from "./plugin.mjs";
import {
  IS_PRODUCTION,
  OFFICIAL_THEMES,
  MARKDOWN_EXTENSION_REGEX,
  CWD
} from "./constants.mjs";
import { findPagesDirectory } from "./file-system.mjs";
var PAGES_DIR = findPagesDirectory();
var IS_WEB_CONTAINER = !!process.versions.webcontainer;
var initGitRepo = (async () => {
  if (!IS_WEB_CONTAINER) {
    const { Repository } = await import("@napi-rs/simple-git");
    try {
      const repository = Repository.discover(CWD);
      if (repository.isShallow()) {
        if (process.env.VERCEL) {
          console.warn(
            "[nextra] The repository is shallow cloned, so the latest modified time will not be presented. Set the VERCEL_DEEP_CLONE=true environment variable to enable deep cloning."
          );
        } else if (process.env.GITHUB_ACTION) {
          console.warn(
            "[nextra] The repository is shallow cloned, so the latest modified time will not be presented. See https://github.com/actions/checkout#fetch-all-history-for-all-tags-and-branches to fetch all the history."
          );
        } else {
          console.warn(
            "[nextra] The repository is shallow cloned, so the latest modified time will not be presented."
          );
        }
      }
      const gitRoot = path.join(repository.path(), "..");
      return { repository, gitRoot };
    } catch (e) {
      console.warn("[nextra] Init git repository failed", e);
    }
  }
  return {};
})();
async function loader(context, source) {
  const {
    isMetaImport = false,
    isPageImport = false,
    theme,
    themeConfig,
    locales,
    defaultLocale,
    defaultShowCopyCode,
    flexsearch,
    latex,
    staticImage,
    readingTime: _readingTime,
    mdxOptions,
    pageMapCache,
    newNextLinkBehavior,
    transform,
    transformPageOpts,
    codeHighlight
  } = context.getOptions();
  context.cacheable(true);
  if (isMetaImport) {
    return "export default () => null";
  }
  const mdxPath = context.resourcePath;
  if (mdxPath.includes("/pages/api/")) {
    console.warn(
      `[nextra] Ignoring ${mdxPath} because it is located in the "pages/api" folder.`
    );
    return "";
  }
  const { items, fileMap } = IS_PRODUCTION ? pageMapCache.get() : await collectFiles(PAGES_DIR, locales);
  if (!fileMap[mdxPath]) {
    fileMap[mdxPath] = await collectMdx(mdxPath);
    if (!IS_PRODUCTION) {
      context.addMissingDependency(mdxPath);
    }
  }
  const { locale } = parseFileName(mdxPath);
  const isLocalTheme = theme.startsWith(".") || theme.startsWith("/");
  const pageNextRoute = "/" + slash(path.relative(PAGES_DIR, mdxPath)).replace(MARKDOWN_EXTENSION_REGEX, "").replace(/\/index$/, "").replace(/^index$/, "");
  if (!IS_PRODUCTION) {
    for (const [filePath, file] of Object.entries(fileMap)) {
      if (file.kind === "Meta" && (!locale || file.locale === locale)) {
        context.addDependency(filePath);
      }
    }
    context.addContextDependency(PAGES_DIR);
    if (isLocalTheme) {
      context.addDependency(path.resolve(theme));
    }
    if (themeConfig) {
      context.addDependency(path.resolve(themeConfig));
    }
  }
  const {
    result,
    headings,
    title,
    frontMatter,
    structurizedData,
    searchIndexKey,
    hasJsxInH1,
    readingTime
  } = await compileMdx(
    source,
    {
      mdxOptions: {
        ...mdxOptions,
        jsx: true,
        outputFormat: "program",
        format: "detect"
      },
      readingTime: _readingTime,
      defaultShowCopyCode,
      staticImage,
      flexsearch,
      latex,
      codeHighlight,
      route: pageNextRoute,
      locale
    },
    {
      filePath: mdxPath,
      useCachedCompiler: false,
      isPageImport
    }
  );
  if (!isPageImport) {
    return result;
  }
  const { route, pageMap, dynamicMetaItems } = resolvePageMap({
    filePath: mdxPath,
    fileMap,
    defaultLocale,
    items
  });
  const fallbackTitle = frontMatter.title || title || pageTitleFromFilename(fileMap[mdxPath].name);
  if (searchIndexKey) {
    if (frontMatter.searchable !== false) {
      const { buildInfo } = context._module;
      buildInfo.nextraSearch = {
        indexKey: searchIndexKey,
        title: fallbackTitle,
        data: structurizedData,
        route: pageNextRoute
      };
    }
  }
  let timestamp;
  const { repository, gitRoot } = await initGitRepo;
  if (repository && gitRoot) {
    try {
      timestamp = await repository.getFileLatestModifiedDateAsync(
        path.relative(gitRoot, mdxPath)
      );
    } catch {
    }
  }
  const layout = isLocalTheme ? path.resolve(theme) : theme;
  let pageOpts = {
    filePath: slash(path.relative(CWD, mdxPath)),
    route,
    frontMatter,
    pageMap,
    headings,
    hasJsxInH1,
    timestamp,
    flexsearch,
    newNextLinkBehavior,
    readingTime,
    title: fallbackTitle
  };
  if (transformPageOpts) {
    pageOpts = transformPageOpts(pageOpts);
  }
  const themeConfigImport = themeConfig ? `import __nextra_themeConfig from '${slash(path.resolve(themeConfig))}'` : "";
  const katexCssImport = latex ? "import 'katex/dist/katex.min.css'" : "";
  const cssImport = OFFICIAL_THEMES.includes(theme) ? `import '${theme}/style.css'` : "";
  const finalResult = transform ? await transform(result, { route: pageNextRoute }) : result;
  const stringifiedPageOpts = JSON.stringify(pageOpts);
  return `import { setupNextraPage } from 'nextra/setup-page'
import __nextra_layout from '${layout}'
${themeConfigImport}
${katexCssImport}
${cssImport}

${finalResult.replace(
    "export default MDXContent;",
    "export { default } from 'nextra/layout'"
  )}

setupNextraPage({
  Content: MDXContent,
  nextraLayout: __nextra_layout,
  hot: module.hot,
  pageOpts: ${stringifiedPageOpts},
  themeConfig: ${themeConfigImport ? "__nextra_themeConfig" : "null"},
  pageNextRoute: ${JSON.stringify(pageNextRoute)},
  pageOptsChecksum: ${IS_PRODUCTION ? "undefined" : JSON.stringify(hashFnv32a(stringifiedPageOpts))},
  dynamicMetaModules: typeof window === 'undefined' ? [${dynamicMetaItems.map(
    (descriptor) => `[import(${JSON.stringify(descriptor.metaFilePath)}), ${JSON.stringify(
      descriptor
    )}]`
  ).join(",")}] : []
})`;
}
function syncLoader(source, callback) {
  loader(this, source).then((result) => callback(null, result)).catch((err) => callback(err));
}
export {
  syncLoader as default
};

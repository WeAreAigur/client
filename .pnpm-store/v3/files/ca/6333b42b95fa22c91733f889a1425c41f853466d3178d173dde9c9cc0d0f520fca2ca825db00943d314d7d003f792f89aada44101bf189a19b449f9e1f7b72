// src/mdx-plugins/rehype.ts
import Slugger from "github-slugger";
import { getFlattenedValue } from "./remark-headings.mjs";
import { CODE_BLOCK_FILENAME_REGEX } from "../constants.mjs";
function visit(node, tagNames, handler) {
  if (tagNames.includes(node.tagName)) {
    handler(node);
    return;
  }
  node.children?.forEach((n) => visit(n, tagNames, handler));
}
var parseMeta = ({ defaultShowCopyCode }) => (tree) => {
  visit(tree, ["pre"], (preEl) => {
    var _a;
    const [codeEl] = preEl.children;
    (_a = codeEl.properties).className || (_a.className = ["language-text"]);
    const meta = codeEl.data?.meta;
    preEl.__nextra_filename = meta?.match(CODE_BLOCK_FILENAME_REGEX)?.[1];
    preEl.__nextra_hasCopyCode = meta ? defaultShowCopyCode && !/( |^)copy=false($| )/.test(meta) || /( |^)copy($| )/.test(meta) : defaultShowCopyCode;
  });
};
var attachMeta = () => (tree) => {
  const slugger = new Slugger();
  const headingsWithSlug = /* @__PURE__ */ new Set(["h2", "h3", "h4", "h5", "h6"]);
  visit(tree, [...headingsWithSlug, "div", "pre"], (node) => {
    var _a;
    if (headingsWithSlug.has(node.tagName)) {
      (_a = node.properties).id || (_a.id = slugger.slug(getFlattenedValue(node)));
      return;
    }
    if ("data-rehype-pretty-code-fragment" in node.properties) {
      Object.assign(node, node.children[0]);
    }
    node.properties.filename = node.__nextra_filename;
    node.properties.hasCopyCode = node.__nextra_hasCopyCode;
  });
};
export {
  attachMeta,
  parseMeta
};

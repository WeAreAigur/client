// src/mdx-plugins/remark-link-rewrite.ts
import { visit } from "unist-util-visit";
var remarkLinkRewrite = ({
  pattern,
  replace
}) => {
  return (tree, _file, done) => {
    visit(tree, "link", (node) => {
      node.url = node.url.replace(pattern, replace);
    });
    done();
  };
};
export {
  remarkLinkRewrite
};

// src/mdx-plugins/remark-headings.ts
import { visit } from "unist-util-visit";
import Slugger from "github-slugger";
var getFlattenedValue = (node) => node.children.map(
  (child) => "children" in child ? getFlattenedValue(child) : "value" in child ? child.value : ""
).join("");
var remarkHeadings = function() {
  const data = this.data();
  const slugger = new Slugger();
  return (tree, _file, done) => {
    visit(
      tree,
      [
        { type: "heading" },
        { name: "summary" },
        { name: "details" }
      ],
      (node) => {
        if (node.type === "heading") {
          const hasJsxInH1 = node.depth === 1 && Array.isArray(node.children) && node.children.some(
            (child) => child.type === "mdxJsxTextElement"
          );
          const value = getFlattenedValue(node);
          const heading = {
            depth: node.depth,
            value,
            id: slugger.slug(value)
          };
          data.headingMeta.headings.push(heading);
          if (hasJsxInH1) {
            data.headingMeta.hasJsxInH1 = true;
          }
          if (node.depth === 1) {
            data.headingMeta.title = heading.value;
          }
          return;
        }
        if (node.data) {
          delete node.data._mdxExplicitJsx;
        }
      }
    );
    done();
  };
};
export {
  getFlattenedValue,
  remarkHeadings
};

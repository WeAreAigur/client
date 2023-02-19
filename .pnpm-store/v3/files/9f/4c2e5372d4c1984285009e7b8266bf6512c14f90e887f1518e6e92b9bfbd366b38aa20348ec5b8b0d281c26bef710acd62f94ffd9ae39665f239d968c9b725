// src/mdx-plugins/static-image.ts
import { visit } from "unist-util-visit";
import path from "path";
import slash from "slash";
import { truthy } from "../utils.mjs";
import { existsSync } from "../file-system.mjs";
import { EXTERNAL_URL_REGEX, PUBLIC_DIR } from "../constants.mjs";
var VALID_BLUR_EXT = [".jpeg", ".png", ".webp", ".avif", ".jpg"];
var getASTNodeImport = (name, from) => ({
  type: "mdxjsEsm",
  value: `import ${name} from "${from}"`,
  data: {
    estree: {
      type: "Program",
      sourceType: "module",
      body: [
        {
          type: "ImportDeclaration",
          specifiers: [
            {
              type: "ImportDefaultSpecifier",
              local: { type: "Identifier", name }
            }
          ],
          source: {
            type: "Literal",
            value: from,
            raw: `"${from}"`
          }
        }
      ]
    }
  }
});
var remarkStaticImage = () => (tree, _file, done) => {
  const importsToInject = [];
  visit(tree, "image", (node) => {
    let url = decodeURI(node.url);
    if (!url) {
      return;
    }
    if (EXTERNAL_URL_REGEX.test(url)) {
      return;
    }
    if (url.startsWith("/")) {
      const urlPath = path.join(PUBLIC_DIR, url);
      if (!existsSync(urlPath)) {
        return;
      }
      url = slash(urlPath);
    }
    const tempVariableName = `$nextraImage${importsToInject.length}`;
    const blur = VALID_BLUR_EXT.some((ext) => url.endsWith(ext));
    Object.assign(node, {
      type: "mdxJsxFlowElement",
      name: "$NextImageNextra",
      children: [],
      attributes: [
        node.alt && {
          type: "mdxJsxAttribute",
          name: "alt",
          value: node.alt
        },
        blur && {
          type: "mdxJsxAttribute",
          name: "placeholder",
          value: "blur"
        },
        {
          type: "mdxJsxAttribute",
          name: "src",
          value: {
            type: "mdxJsxAttributeValueExpression",
            value: tempVariableName,
            data: {
              estree: {
                type: "Program",
                sourceType: "module",
                body: [
                  {
                    type: "ExpressionStatement",
                    expression: {
                      type: "Identifier",
                      name: tempVariableName
                    }
                  }
                ]
              }
            }
          }
        }
      ].filter(truthy)
    });
    importsToInject.push(getASTNodeImport(tempVariableName, url));
  });
  tree.children.unshift(
    getASTNodeImport("$NextImageNextra", "next/image"),
    ...importsToInject
  );
  done();
};
export {
  remarkStaticImage
};

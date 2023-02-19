import { visit } from "unist-util-visit";

const createTest = ({ whiteList, blackList } = {}) => {
  if (whiteList && whiteList.length) {
    return (node) =>
      Boolean(node.data) && Boolean(node.name) && whiteList.includes(node.name);
  } else if (blackList && blackList.length) {
    return (node) =>
      Boolean(node.data) &&
      Boolean(node.name) &&
      !blackList.includes(node.name);
  } else {
    return (node) => Boolean(node.data);
  }
};

export default function remarkMdxDisableExplicitJsx(options = {}) {
  if (typeof options !== `object`) {
    throw new TypeError(`Options should be an object`);
  } else if (options.whiteList && options.blackList) {
    throw new Error(`"whiteList" and "blackList" can't be used together`);
  } else if (options.whiteList && !Array.isArray(options.whiteList)) {
    throw new TypeError(`"whiteList" value should be an array`);
  } else if (options.blackList && !Array.isArray(options.blackList)) {
    throw new TypeError(`"blackList" value should be an array`);
  }

  const test = createTest(options);

  return (root) => {
    visit(root, test, function (node) {
      delete node.data._mdxExplicitJsx;
      delete node.data._xdmExplicitJsx;
    });
  };
}

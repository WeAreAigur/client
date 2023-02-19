// src/page-map.ts
import { parseFileName } from "./utils.mjs";
import filterRouteLocale from "./filter-route-locale.mjs";
import { IS_PRODUCTION } from "./constants.mjs";
function getDynamicMeta(path, items) {
  const newItems = [];
  const dynamicMetaItems = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === "Folder") {
      const [dynamicItemsInChildren, newItemsInChildren] = getDynamicMeta(
        `${path}[${i}].children`,
        item.children
      );
      dynamicMetaItems.push(...dynamicItemsInChildren);
      newItems.push({
        ...item,
        children: newItemsInChildren
      });
      continue;
    }
    if (item.kind === "Meta" && item.__nextra_src) {
      const { __nextra_src, ...newItem } = item;
      dynamicMetaItems.push({
        metaFilePath: __nextra_src,
        metaObjectKeyPath: `${path}[${i}]`,
        metaParentKeyPath: path.replace(/\.children$/, "")
      });
      newItems.push(newItem);
      continue;
    }
    newItems.push(item);
  }
  return [dynamicMetaItems, newItems];
}
var cachedDynamicMetaForLocale = /* @__PURE__ */ Object.create(null);
function resolvePageMap({
  filePath,
  items,
  fileMap,
  defaultLocale
}) {
  let { locale } = parseFileName(filePath);
  locale || (locale = defaultLocale);
  const pageItem = fileMap[filePath];
  const [dynamicMetaItems, newItems] = IS_PRODUCTION && cachedDynamicMetaForLocale[locale] || (cachedDynamicMetaForLocale[locale] = getDynamicMeta(
    "",
    locale ? filterRouteLocale(items, locale, defaultLocale) : items
  ));
  return {
    pageMap: newItems,
    route: pageItem.route,
    dynamicMetaItems
  };
}
export {
  resolvePageMap
};

// src/file-system.ts
import { findPagesDir, existsSync } from "next/dist/lib/find-pages-dir.js";
import { CWD } from "./constants.mjs";
function findPagesDirectory() {
  const res = findPagesDir(CWD, false);
  return res.pagesDir || res.pages;
}
export {
  existsSync,
  findPagesDirectory
};

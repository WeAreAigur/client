"use strict";
var _defineRule = require("../utils/define-rule");
var url = "https://nextjs.org/docs/messages/no-head-element";
module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: "Prevent usage of `<head>` element.",
            category: "HTML",
            recommended: true,
            url: url
        },
        type: "problem",
        schema: []
    },
    create: function create(context) {
        return {
            JSXOpeningElement: function JSXOpeningElement(node) {
                var paths = context.getFilename();
                var isInAppDir = paths.includes("app/") && !paths.includes("pages/");
                // Only lint the <head> element in pages directory
                if (node.name.name !== "head" || isInAppDir) {
                    return;
                }
                context.report({
                    node: node,
                    message: "Do not use `<head>` element. Use `<Head />` from `next/head` instead. See: ".concat(url)
                });
            }
        };
    }
});

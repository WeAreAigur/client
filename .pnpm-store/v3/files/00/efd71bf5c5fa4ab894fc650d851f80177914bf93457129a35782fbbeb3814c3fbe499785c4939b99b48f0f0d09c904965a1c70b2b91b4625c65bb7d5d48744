import React from "react";
import { Meta } from "./meta";
export function BasicMetadata({ metadata  }) {
    var ref, ref1, ref2, ref3;
    return /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("meta", {
        charSet: "utf-8"
    }), metadata.title !== null ? /*#__PURE__*/ React.createElement("title", null, metadata.title.absolute) : null, /*#__PURE__*/ React.createElement(Meta, {
        name: "description",
        content: metadata.description
    }), /*#__PURE__*/ React.createElement(Meta, {
        name: "application-name",
        content: metadata.applicationName
    }), /*#__PURE__*/ React.createElement(Meta, {
        name: "author",
        content: (ref = metadata.authors) == null ? void 0 : ref.join(",")
    }), /*#__PURE__*/ React.createElement(Meta, {
        name: "generator",
        content: metadata.generator
    }), /*#__PURE__*/ React.createElement(Meta, {
        name: "keywords",
        content: (ref1 = metadata.keywords) == null ? void 0 : ref1.join(",")
    }), /*#__PURE__*/ React.createElement(Meta, {
        name: "referrer",
        content: metadata.referrer
    }), /*#__PURE__*/ React.createElement(Meta, {
        name: "theme-color",
        content: metadata.themeColor
    }), /*#__PURE__*/ React.createElement(Meta, {
        name: "color-scheme",
        content: metadata.colorScheme
    }), /*#__PURE__*/ React.createElement(Meta, {
        name: "viewport",
        content: metadata.viewport
    }), /*#__PURE__*/ React.createElement(Meta, {
        name: "creator",
        content: metadata.creator
    }), /*#__PURE__*/ React.createElement(Meta, {
        name: "publisher",
        content: metadata.publisher
    }), /*#__PURE__*/ React.createElement(Meta, {
        name: "robots",
        content: (ref2 = metadata.robots) == null ? void 0 : ref2.basic
    }), /*#__PURE__*/ React.createElement(Meta, {
        name: "googlebot",
        content: (ref3 = metadata.robots) == null ? void 0 : ref3.googleBot
    }), /*#__PURE__*/ React.createElement(Meta, {
        name: "abstract",
        content: metadata.abstract
    }), metadata.archives ? metadata.archives.map((archive)=>/*#__PURE__*/ React.createElement("link", {
            rel: "archives",
            href: archive,
            key: archive
        })) : null, metadata.assets ? metadata.assets.map((asset)=>/*#__PURE__*/ React.createElement("link", {
            rel: "assets",
            href: asset,
            key: asset
        })) : null, metadata.bookmarks ? metadata.bookmarks.map((bookmark)=>/*#__PURE__*/ React.createElement("link", {
            rel: "bookmarks",
            href: bookmark,
            key: bookmark
        })) : null, /*#__PURE__*/ React.createElement(Meta, {
        name: "category",
        content: metadata.category
    }), /*#__PURE__*/ React.createElement(Meta, {
        name: "classification",
        content: metadata.classification
    }), metadata.other ? Object.entries(metadata.other).map(([name, content])=>/*#__PURE__*/ React.createElement(Meta, {
            key: name,
            name: name,
            content: Array.isArray(content) ? content.join(",") : content
        })) : null);
}
export function ItunesMeta({ itunes  }) {
    if (!itunes) return null;
    const { appId , appArgument  } = itunes;
    let content = `app-id=${appId}`;
    if (appArgument) {
        content += `, app-argument=${appArgument}`;
    }
    return /*#__PURE__*/ React.createElement("meta", {
        name: "apple-itunes-app",
        content: content
    });
}
const formatDetectionKeys = [
    "telephone",
    "date",
    "address",
    "email",
    "url", 
];
export function FormatDetectionMeta({ formatDetection  }) {
    if (!formatDetection) return null;
    let content = "";
    for (const key of formatDetectionKeys){
        if (formatDetection[key]) {
            if (content) content += ", ";
            content += `${key}=no`;
        }
    }
    return /*#__PURE__*/ React.createElement("meta", {
        name: "format-detection",
        content: content
    });
}
export function AppleWebAppMeta({ appleWebApp  }) {
    if (!appleWebApp) return null;
    const { capable , title , startupImage , statusBarStyle  } = appleWebApp;
    return /*#__PURE__*/ React.createElement(React.Fragment, null, capable ? /*#__PURE__*/ React.createElement("meta", {
        name: "apple-mobile-web-app-capable",
        content: "yes"
    }) : null, title ? /*#__PURE__*/ React.createElement("meta", {
        name: "apple-mobile-web-app-title",
        content: title
    }) : null, startupImage ? startupImage.map((image, index)=>/*#__PURE__*/ React.createElement("link", {
            key: index,
            href: image.url,
            media: image.media,
            rel: "apple-touch-startup-image"
        })) : null, statusBarStyle ? /*#__PURE__*/ React.createElement("meta", {
        name: "apple-mobile-web-app-status-bar-style",
        content: statusBarStyle
    }) : null);
}

//# sourceMappingURL=basic.js.map
import React from "react";
import { AppleWebAppMeta, FormatDetectionMeta, ItunesMeta, BasicMetadata } from "./generate/basic";
import { AlternatesMetadata } from "./generate/alternate";
import { OpenGraphMetadata, TwitterMetadata, AppLinksMeta } from "./generate/opengraph";
import { resolveMetadata } from "./resolve-metadata";
import { IconsMetadata } from "./generate/icons";
// Generate the actual React elements from the resolved metadata.
export async function Metadata({ metadata  }) {
    if (!metadata) return null;
    const resolved = await resolveMetadata(metadata);
    return /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(BasicMetadata, {
        metadata: resolved
    }), /*#__PURE__*/ React.createElement(AlternatesMetadata, {
        alternates: resolved.alternates
    }), /*#__PURE__*/ React.createElement(ItunesMeta, {
        itunes: resolved.itunes
    }), /*#__PURE__*/ React.createElement(FormatDetectionMeta, {
        formatDetection: resolved.formatDetection
    }), /*#__PURE__*/ React.createElement(AppleWebAppMeta, {
        appleWebApp: resolved.appleWebApp
    }), /*#__PURE__*/ React.createElement(OpenGraphMetadata, {
        openGraph: resolved.openGraph
    }), /*#__PURE__*/ React.createElement(TwitterMetadata, {
        twitter: resolved.twitter
    }), /*#__PURE__*/ React.createElement(AppLinksMeta, {
        appLinks: resolved.appLinks
    }), /*#__PURE__*/ React.createElement(IconsMetadata, {
        icons: resolved.icons
    }));
}

//# sourceMappingURL=metadata.js.map
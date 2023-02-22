import type { AlternateURLs, ResolvedAlternateURLs } from './alternative-urls-types';
import type { AppleWebApp, AppLinks, FormatDetection, ItunesApp, ResolvedAppleWebApp, ResolvedAppLinks, Viewport } from './extra-types';
import type { AbsoluteTemplateString, Author, ColorSchemeEnum, Icon, Icons, IconURL, ReferrerEnum, ResolvedIcons, ResolvedVerification, Robots, ResolvedRobots, TemplateString, Verification } from './metadata-types';
import type { OpenGraph, ResolvedOpenGraph } from './opengraph-types';
import { ResolvedTwitterMetadata, Twitter } from './twitter-types';
export interface Metadata {
    metadataBase: null | URL;
    title?: null | string | TemplateString;
    description?: null | string;
    applicationName?: null | string;
    authors?: null | Author | Array<Author>;
    generator?: null | string;
    keywords?: null | string | Array<string>;
    referrer?: null | ReferrerEnum;
    themeColor?: null | string;
    colorScheme?: null | ColorSchemeEnum;
    viewport?: null | string | Viewport;
    creator?: null | string;
    publisher?: null | string;
    robots?: null | string | Robots;
    alternates?: null | AlternateURLs;
    icons?: null | IconURL | Array<Icon> | Icons;
    openGraph?: null | OpenGraph;
    twitter?: null | Twitter;
    verification?: Verification;
    appleWebApp?: null | boolean | AppleWebApp;
    formatDetection?: null | FormatDetection;
    itunes?: null | ItunesApp;
    abstract?: null | string;
    appLinks?: null | AppLinks;
    archives?: null | string | Array<string>;
    assets?: null | string | Array<string>;
    bookmarks?: null | string | Array<string>;
    category?: null | string;
    classification?: null | string;
    other?: {
        [name: string]: string | number | Array<string | number>;
    };
    /**
     *  Deprecated options that have a preferred method
     * */
    'apple-touch-fullscreen'?: never;
    'apple-touch-icon-precomposed'?: never;
}
export interface ResolvedMetadata {
    metadataBase: null | URL;
    title: null | AbsoluteTemplateString;
    description: null | string;
    applicationName: null | string;
    authors: null | Array<Author>;
    generator: null | string;
    keywords: null | Array<string>;
    referrer: null | ReferrerEnum;
    themeColor: null | string;
    colorScheme: null | ColorSchemeEnum;
    viewport: null | string;
    creator: null | string;
    publisher: null | string;
    robots: null | ResolvedRobots;
    alternates: null | ResolvedAlternateURLs;
    icons: null | ResolvedIcons;
    openGraph: null | ResolvedOpenGraph;
    twitter: null | ResolvedTwitterMetadata;
    verification: null | ResolvedVerification;
    appleWebApp: null | ResolvedAppleWebApp;
    formatDetection: null | FormatDetection;
    itunes: null | ItunesApp;
    abstract: null | string;
    appLinks: null | ResolvedAppLinks;
    archives: null | Array<string>;
    assets: null | Array<string>;
    bookmarks: null | Array<string>;
    category: null | string;
    classification: null | string;
    other: null | {
        [name: string]: string | number | Array<string | number>;
    };
    /**
     *  Deprecated options that have a preferred method
     * */
    'apple-touch-fullscreen'?: never;
    'apple-touch-icon-precomposed'?: never;
}
export declare type ResolvingMetadata = Promise<ResolvedMetadata>;

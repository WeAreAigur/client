/**
 *
 * Metadata types
 *
 */
export declare type TemplateString = DefaultTemplateString | AbsoluteTemplateString | AbsoluteString;
export declare type DefaultTemplateString = {
    default: string;
    template: string;
};
export declare type AbsoluteTemplateString = {
    absolute: string;
    template: string | null;
};
export declare type AbsoluteString = {
    absolute: string;
};
export declare type Author = {
    url?: string | URL;
    name?: string;
};
export declare type ReferrerEnum = 'no-referrer' | 'origin' | 'no-referrer-when-downgrade' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin';
export declare type ColorSchemeEnum = 'normal' | 'light' | 'dark' | 'light dark' | 'dark light' | 'only light';
declare type RobotsInfo = {
    index?: boolean;
    follow?: boolean;
    /** @deprecated set index to false instead */
    noindex?: never;
    /** @deprecated set follow to false instead */
    nofollow?: never;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
    nocache?: boolean;
};
export declare type Robots = RobotsInfo & {
    googleBot?: string | RobotsInfo;
};
export declare type ResolvedRobots = {
    basic: string | null;
    googleBot: string | null;
};
export declare type IconURL = string | URL;
export declare type Icon = IconURL | IconDescriptor;
export declare type IconDescriptor = {
    url: string | URL;
    type?: string;
    sizes?: string;
    rel?: string;
};
export declare type Icons = {
    icon?: Icon | Icon[];
    shortcut?: Icon | Icon[];
    apple?: Icon | Icon[];
    other?: IconDescriptor | IconDescriptor[];
};
export declare type Verification = {
    google?: null | string | number | (string | number)[];
    yahoo?: null | string | number | (string | number)[];
    other?: {
        [name: string]: string | number | (string | number)[];
    };
};
export declare type ResolvedVerification = {
    google?: null | (string | number)[];
    yahoo?: null | (string | number)[];
    other?: {
        [name: string]: (string | number)[];
    };
};
export declare type ResolvedIcons = {
    icon?: IconDescriptor[];
    shortcut?: IconDescriptor[];
    apple?: IconDescriptor[];
    other?: IconDescriptor[];
};
export {};

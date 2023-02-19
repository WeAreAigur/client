import React$1 from 'react';
import { useSpring } from 'use-spring';
import { IRawTheme } from 'vscode-textmate';
import { SandboxInfo } from '@codesandbox/sandpack-client';
import { MDXComponents } from 'mdx/types';

declare function Section({ children, className, style, ...props }: {
    children: React$1.ReactNode;
    className?: string;
    style?: React$1.CSSProperties;
}): JSX.Element;
declare function SectionCode(innerProps: any): JSX.Element;
declare function SectionLink({ focus, file, children, id, }: {
    focus: string;
    id: string;
    file?: string;
    children: React$1.ReactNode;
}): JSX.Element;

declare type HighlightedToken = {
    content: string;
    props: {
        style?: React.CSSProperties;
    };
};
declare type HighlightedLine = {
    tokens: HighlightedToken[];
};
declare type Code$1 = {
    lines: HighlightedLine[];
    lang: string;
};

declare type FocusString = string | null | undefined;

/**
 * A single theme setting.
 */
interface IRawThemeSetting {
    name?: string;
    scope?: string | string[];
    settings: {
        fontStyle?: string;
        foreground?: string;
        background?: string;
    };
}
/**
 * A TextMate theme.
 */
interface EditorTheme {
    name?: string;
    type?: string;
    colors?: Record<string, string>;
    tokenColors?: IRawThemeSetting[];
    settings?: IRawThemeSetting[];
    semanticTokenColors?: any;
    semanticHighlighting?: boolean;
}

declare type CodeAnnotation = {
    focus: string;
    Component?: (props: {
        style?: React$1.CSSProperties;
        children: React$1.ReactNode;
        data: any;
        theme: EditorTheme;
        isInline: boolean;
    }) => React$1.ReactElement;
    data?: any;
};

declare type CodeStep = {
    code: Code$1;
    focus: FocusString;
    annotations?: CodeAnnotation[];
};
declare type CodeConfig = {
    parentHeight?: any;
    minColumns?: number;
    minZoom?: number;
    maxZoom?: number;
    horizontalCenter?: boolean;
    theme: IRawTheme;
    lineNumbers?: boolean;
    showCopyButton?: boolean;
    showExpandButton?: boolean;
    staticMediaQuery?: string;
    rows?: number | "focus" | (number | "focus")[];
    debug?: boolean;
};

declare type AppClassName = string;
declare type LibClassName = string;
declare type Classes = Record<LibClassName, AppClassName>;

declare type Tab = {
    title: string;
    active: boolean;
    style: React$1.CSSProperties;
};
declare type OutputPanel = {
    tabs: Tab[];
    style: React$1.CSSProperties;
    children: React$1.ReactNode;
};
declare type EditorFrameProps = {
    northPanel: OutputPanel;
    southPanel?: OutputPanel | null;
    theme: EditorTheme;
    terminalPanel?: React$1.ReactNode;
    height?: number;
    northButton?: React$1.ReactNode;
    southButton?: React$1.ReactNode;
    classes?: Classes;
    onTabClick?: (filename: string) => void;
} & React$1.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

declare type CodeFile = CodeStep & {
    name: string;
};
declare type EditorPanel = {
    tabs: string[];
    active: string;
    heightRatio: number;
};
declare type EditorStep = {
    files: CodeFile[];
    northPanel: EditorPanel;
    southPanel?: EditorPanel;
    terminal?: string;
};

declare type SpringConfig = Parameters<typeof useSpring>[1];
declare type DivProps = React$1.PropsWithoutRef<JSX.IntrinsicElements["div"]>;
declare type EditorProps = EditorStep & {
    frameProps?: Partial<EditorFrameProps>;
    codeConfig: CodeConfig;
    springConfig?: SpringConfig;
} & DivProps;
declare function EditorSpring({ northPanel, southPanel, files, terminal, springConfig, ...props }: EditorProps): JSX.Element;

declare type CodeHikeConfig = {
    theme: any;
    lineNumbers?: boolean;
    autoImport?: boolean;
    skipLanguages: string[];
    showExpandButton?: boolean;
    showCopyButton?: boolean;
    staticMediaQuery?: string;
    filepath?: string;
};

declare function Code(props: EditorProps & Partial<CodeHikeConfig>): JSX.Element;

declare type PresetConfig = SandboxInfo;
declare function Preview({ className, files, presetConfig, show, children, codeConfig, style, frameless, ...rest }: {
    className: string;
    frameless?: boolean;
    files: EditorStep["files"];
    presetConfig?: PresetConfig;
    show?: string;
    style?: React$1.CSSProperties;
    children?: React$1.ReactNode;
    codeConfig: {
        theme: EditorTheme;
    };
}): JSX.Element;

declare function Spotlight({ children, editorSteps, codeConfig, start, presetConfig, className, style, hasPreviewSteps, ...rest }: {
    children: React$1.ReactNode;
    editorSteps: EditorStep[];
    codeConfig: EditorProps["codeConfig"];
    start?: number;
    presetConfig?: PresetConfig;
    className?: string;
    style?: React$1.CSSProperties;
    hasPreviewSteps?: boolean;
}): JSX.Element;

declare function Scrollycoding(props: any): JSX.Element;

declare function CodeSlot(): JSX.Element;
declare function PreviewSlot(): JSX.Element;

declare type ChangeEvent = {
    index: number;
};
declare function Slideshow({ children, className, code, codeConfig, editorSteps, autoFocus, hasPreviewSteps, start, onChange: onSlideshowChange, presetConfig, style, autoPlay, loop, ...rest }: {
    children: React$1.ReactNode;
    className?: string;
    code?: EditorProps["codeConfig"];
    codeConfig: EditorProps["codeConfig"];
    editorSteps: EditorStep[];
    hasPreviewSteps?: boolean;
    autoFocus?: boolean;
    start?: number;
    onChange?: (e: ChangeEvent) => void;
    presetConfig?: PresetConfig;
    style?: React$1.CSSProperties;
    autoPlay?: number;
    loop?: boolean;
}): JSX.Element;

declare function Annotation(): JSX.Element;
declare const annotationsMap: Record<string, CodeAnnotation["Component"]>;

declare function InlineCode({ className, codeConfig, children, code, ...rest }: {
    className: string;
    code: Code$1;
    children?: React$1.ReactNode;
    codeConfig: {
        theme: EditorTheme;
    };
}): JSX.Element;

declare type MiniBrowserStep = {
    /**
     * The url to display on the navigation bar.
     */
    url?: string;
    /**
     * Override the url used for the iframe and "Open in new tab" button.
     */
    loadUrl?: string;
    /**
     * Scale the content of the browser.
     */
    zoom?: number;
    /**
     * Prepend the current origin to the url.
     */
    prependOrigin?: boolean;
    /**
     * The content to display in the browser. If not provided, an iframe for the url will be displayed.
     */
    children?: React$1.ReactNode;
};

declare type Transition = "none" | "slide";
declare type MiniBrowserHikeProps = {
    progress?: number;
    backward?: boolean;
    classes?: Classes;
    steps?: MiniBrowserStep[];
    transition?: Transition;
    theme: EditorTheme;
} & React$1.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

declare type MiniBrowserProps = Omit<MiniBrowserHikeProps, "progress" | "steps" | "backward"> & MiniBrowserStep;

declare function MiniBrowser({ url, loadUrl, prependOrigin, children, zoom, ...rest }: MiniBrowserProps): JSX.Element;

declare const CH: MDXComponents;

declare const internal: {
    MiniBrowser: typeof MiniBrowser;
    EditorSpring: typeof EditorSpring;
};

export { Annotation, CH, Code, CodeSlot, InlineCode, Preview, PreviewSlot, Scrollycoding, Section, SectionCode, SectionLink, Slideshow, Spotlight, annotationsMap as annotations, internal };

import { Node } from 'unist';

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

declare type VFile = {
    history: string[];
    cwd: string;
};
declare type Transformer = (node: Node, file: VFile) => Promise<void>;
declare type CodeHikeRemarkPlugin = (config: CodeHikeConfig) => Transformer;
declare const attacher: CodeHikeRemarkPlugin;

declare type HighlightedToken = {
    content: string;
    props: {
        style?: React.CSSProperties;
    };
};
declare type HighlightedLine = {
    tokens: HighlightedToken[];
};
declare type Code = {
    lines: HighlightedLine[];
    lang: string;
};

declare function highlight({ code, lang, theme, }: {
    code: string;
    lang: string;
    theme: any;
}): Promise<Code>;

export { highlight, attacher as remarkCodeHike };

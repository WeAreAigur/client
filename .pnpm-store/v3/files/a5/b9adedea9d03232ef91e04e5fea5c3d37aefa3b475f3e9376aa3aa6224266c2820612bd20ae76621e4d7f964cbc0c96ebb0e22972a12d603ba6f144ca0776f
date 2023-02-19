import type { Metadata, ResolvedMetadata, ResolvingMetadata } from './types/metadata-interface';
declare type Item = {
    type: 'layout' | 'page';
    layer: number;
    mod: () => Promise<{
        metadata?: Metadata;
        generateMetadata?: (props: any, parent: ResolvingMetadata) => Promise<Metadata>;
    }>;
    path: string;
} | {
    type: 'icon';
    layer: number;
    mod?: () => Promise<{
        metadata?: Metadata;
        generateMetadata?: (props: any, parent: ResolvingMetadata) => Promise<Metadata>;
    }>;
    path?: string;
};
export declare function resolveMetadata(metadataItems: Item[]): Promise<ResolvedMetadata>;
export declare function resolveFileBasedMetadataForLoader(_layer: number, _dir: string): Promise<string>;
export {};

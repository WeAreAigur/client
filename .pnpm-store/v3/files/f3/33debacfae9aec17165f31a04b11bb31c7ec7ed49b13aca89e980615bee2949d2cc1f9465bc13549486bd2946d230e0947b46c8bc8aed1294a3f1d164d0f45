import React from 'react';
export declare function Meta({ name, property, content, }: {
    name?: string;
    property?: string;
    content: string | number | URL | null | undefined;
}): React.ReactElement | null;
declare type ExtendMetaContent = Record<string, undefined | string | URL | number | boolean | null | undefined>;
declare type MultiMetaContent = (ExtendMetaContent | string | URL | number)[] | null | undefined;
export declare function ExtendMeta({ content, namePrefix, propertyPrefix, }: {
    content?: ExtendMetaContent;
    namePrefix?: string;
    propertyPrefix?: string;
}): JSX.Element | null;
export declare function MultiMeta({ propertyPrefix, namePrefix, contents, }: {
    propertyPrefix?: string;
    namePrefix?: string;
    contents?: MultiMetaContent | null;
}): JSX.Element | null;
export {};

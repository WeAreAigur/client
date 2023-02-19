import React from 'react';
import { MDXRemoteSerializeResult, SerializeOptions } from './types';
import { VFileCompatible } from 'vfile';
import { MDXProvider } from '@mdx-js/react';
export declare type MDXRemoteProps = MDXRemoteSerializeResult & {
    source: VFileCompatible;
    options?: SerializeOptions;
    /**
     * An object mapping names to React components.
     * The key used will be the name accessible to MDX.
     *
     * For example: `{ ComponentName: Component }` will be accessible in the MDX as `<ComponentName/>`.
     */
    components?: React.ComponentProps<typeof MDXProvider>['components'];
};
export { MDXRemoteSerializeResult };
export declare function compileMDX({ source, options, components, }: MDXRemoteProps): Promise<{
    content: JSX.Element;
    frontmatter: Record<string, string> | undefined;
}>;
/**
 * Renders compiled source from next-mdx-remote/serialize.
 */
export declare function MDXRemote(props: MDXRemoteProps): Promise<JSX.Element>;

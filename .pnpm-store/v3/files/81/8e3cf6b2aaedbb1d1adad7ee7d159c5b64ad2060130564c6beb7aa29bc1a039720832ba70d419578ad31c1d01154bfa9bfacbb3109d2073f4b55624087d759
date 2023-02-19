import { CacheStates } from '../../../shared/lib/app-router-context';
import { createHrefFromUrl } from './create-href-from-url';
export function createInitialRouterState({ initialTree , children , initialCanonicalUrl , initialParallelRoutes  }) {
    return {
        tree: initialTree,
        cache: {
            status: CacheStates.READY,
            data: null,
            subTreeData: children,
            parallelRoutes: typeof window === 'undefined' ? new Map() : initialParallelRoutes
        },
        prefetchCache: new Map(),
        pushRef: {
            pendingPush: false,
            mpaNavigation: false
        },
        focusAndScrollRef: {
            apply: false
        },
        canonicalUrl: // location.href is read as the initial value for canonicalUrl in the browser
        // This is safe to do as canonicalUrl can't be rendered, it's only used to control the history updates in the useEffect further down in this file.
        typeof window !== 'undefined' ? createHrefFromUrl(window.location) : initialCanonicalUrl
    };
}

//# sourceMappingURL=create-initial-router-state.js.map
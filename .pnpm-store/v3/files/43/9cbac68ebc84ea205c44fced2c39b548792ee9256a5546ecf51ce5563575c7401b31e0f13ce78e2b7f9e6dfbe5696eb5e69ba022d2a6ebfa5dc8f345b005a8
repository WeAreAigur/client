import type { ReactNode } from 'react';
import type { CacheNode } from '../../../shared/lib/app-router-context';
import type { FlightRouterState } from '../../../server/app-render';
export interface InitialRouterStateParameters {
    initialTree: FlightRouterState;
    initialCanonicalUrl: string;
    children: ReactNode;
    initialParallelRoutes: CacheNode['parallelRoutes'];
}
export declare function createInitialRouterState({ initialTree, children, initialCanonicalUrl, initialParallelRoutes, }: InitialRouterStateParameters): {
    tree: FlightRouterState;
    cache: CacheNode;
    prefetchCache: Map<any, any>;
    pushRef: {
        pendingPush: boolean;
        mpaNavigation: boolean;
    };
    focusAndScrollRef: {
        apply: boolean;
    };
    canonicalUrl: string;
};

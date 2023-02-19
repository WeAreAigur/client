"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reducer = exports.ACTION_PREFETCH = exports.ACTION_SERVER_PATCH = exports.ACTION_RESTORE = exports.ACTION_NAVIGATE = exports.ACTION_REFRESH = void 0;
var _appRouterContext = require("../../../shared/lib/app-router-context");
var _fetchServerResponse = require("./fetch-server-response");
var _createRecordFromThenable = require("./create-record-from-thenable");
var _readRecordValue = require("./read-record-value");
var _createHrefFromUrl = require("./create-href-from-url");
var _fillLazyItemsTillLeafWithHead = require("./fill-lazy-items-till-leaf-with-head");
var _fillCacheWithNewSubtreeData = require("./fill-cache-with-new-subtree-data");
var _invalidateCacheBelowFlightSegmentpath = require("./invalidate-cache-below-flight-segmentpath");
var _fillCacheWithDataProperty = require("./fill-cache-with-data-property");
var _createOptimisticTree = require("./create-optimistic-tree");
var _applyRouterStatePatchToTree = require("./apply-router-state-patch-to-tree");
var _shouldHardNavigate = require("./should-hard-navigate");
var _isNavigatingToNewRootLayout = require("./is-navigating-to-new-root-layout");
const ACTION_REFRESH = 'refresh';
exports.ACTION_REFRESH = ACTION_REFRESH;
const ACTION_NAVIGATE = 'navigate';
exports.ACTION_NAVIGATE = ACTION_NAVIGATE;
const ACTION_RESTORE = 'restore';
exports.ACTION_RESTORE = ACTION_RESTORE;
const ACTION_SERVER_PATCH = 'server-patch';
exports.ACTION_SERVER_PATCH = ACTION_SERVER_PATCH;
const ACTION_PREFETCH = 'prefetch';
exports.ACTION_PREFETCH = ACTION_PREFETCH;
/**
 * Reducer that handles the app-router state updates.
 */ function clientReducer(state, action) {
    switch(action.type){
        case ACTION_NAVIGATE:
            {
                const { url , navigateType , cache , mutable , forceOptimisticNavigation  } = action;
                const { pathname , search  } = url;
                const href = (0, _createHrefFromUrl).createHrefFromUrl(url);
                const pendingPush = navigateType === 'push';
                const isForCurrentTree = JSON.stringify(mutable.previousTree) === JSON.stringify(state.tree);
                if (mutable.mpaNavigation && isForCurrentTree) {
                    return {
                        // Set href.
                        canonicalUrl: mutable.canonicalUrlOverride ? mutable.canonicalUrlOverride : href,
                        pushRef: {
                            pendingPush,
                            mpaNavigation: mutable.mpaNavigation
                        },
                        // All navigation requires scroll and focus management to trigger.
                        focusAndScrollRef: {
                            apply: false
                        },
                        // Apply cache.
                        cache: state.cache,
                        prefetchCache: state.prefetchCache,
                        // Apply patched router state.
                        tree: state.tree
                    };
                }
                // Handle concurrent rendering / strict mode case where the cache and tree were already populated.
                if (mutable.patchedTree && isForCurrentTree) {
                    return {
                        // Set href.
                        canonicalUrl: mutable.canonicalUrlOverride ? mutable.canonicalUrlOverride : href,
                        pushRef: {
                            pendingPush,
                            mpaNavigation: false
                        },
                        // All navigation requires scroll and focus management to trigger.
                        focusAndScrollRef: {
                            apply: true
                        },
                        // Apply cache.
                        cache: mutable.useExistingCache ? state.cache : cache,
                        prefetchCache: state.prefetchCache,
                        // Apply patched router state.
                        tree: mutable.patchedTree
                    };
                }
                const prefetchValues = state.prefetchCache.get(href);
                if (prefetchValues) {
                    // The one before last item is the router state tree patch
                    const { flightData , tree: newTree , canonicalUrlOverride ,  } = prefetchValues;
                    // Handle case when navigating to page in `pages` from `app`
                    if (typeof flightData === 'string') {
                        return {
                            canonicalUrl: flightData,
                            // Enable mpaNavigation
                            pushRef: {
                                pendingPush: true,
                                mpaNavigation: true
                            },
                            // Don't apply scroll and focus management.
                            focusAndScrollRef: {
                                apply: false
                            },
                            cache: state.cache,
                            prefetchCache: state.prefetchCache,
                            tree: state.tree
                        };
                    }
                    if (newTree !== null) {
                        mutable.previousTree = state.tree;
                        mutable.patchedTree = newTree;
                        mutable.mpaNavigation = (0, _isNavigatingToNewRootLayout).isNavigatingToNewRootLayout(state.tree, newTree);
                        if (newTree === null) {
                            throw new Error('SEGMENT MISMATCH');
                        }
                        const canonicalUrlOverrideHrefVal = canonicalUrlOverride ? (0, _createHrefFromUrl).createHrefFromUrl(canonicalUrlOverride) : undefined;
                        if (canonicalUrlOverrideHrefVal) {
                            mutable.canonicalUrlOverride = canonicalUrlOverrideHrefVal;
                        }
                        mutable.mpaNavigation = (0, _isNavigatingToNewRootLayout).isNavigatingToNewRootLayout(state.tree, newTree);
                        // TODO-APP: Currently the Flight data can only have one item but in the future it can have multiple paths.
                        const flightDataPath = flightData[0];
                        const flightSegmentPath = flightDataPath.slice(0, -3);
                        // The one before last item is the router state tree patch
                        const [treePatch, subTreeData, head] = flightDataPath.slice(-3);
                        // Handles case where prefetch only returns the router tree patch without rendered components.
                        if (subTreeData !== null) {
                            if (flightDataPath.length === 3) {
                                cache.status = _appRouterContext.CacheStates.READY;
                                cache.subTreeData = subTreeData;
                                cache.parallelRoutes = new Map();
                                (0, _fillLazyItemsTillLeafWithHead).fillLazyItemsTillLeafWithHead(cache, state.cache, treePatch, head);
                            } else {
                                cache.status = _appRouterContext.CacheStates.READY;
                                // Copy subTreeData for the root node of the cache.
                                cache.subTreeData = state.cache.subTreeData;
                                // Create a copy of the existing cache with the subTreeData applied.
                                (0, _fillCacheWithNewSubtreeData).fillCacheWithNewSubTreeData(cache, state.cache, flightDataPath);
                            }
                        }
                        const hardNavigate = // TODO-APP: Revisit if this is correct.
                        search !== location.search || (0, _shouldHardNavigate).shouldHardNavigate(// TODO-APP: remove ''
                        [
                            '',
                            ...flightSegmentPath
                        ], state.tree);
                        if (hardNavigate) {
                            cache.status = _appRouterContext.CacheStates.READY;
                            // Copy subTreeData for the root node of the cache.
                            cache.subTreeData = state.cache.subTreeData;
                            (0, _invalidateCacheBelowFlightSegmentpath).invalidateCacheBelowFlightSegmentPath(cache, state.cache, flightSegmentPath);
                        // Ensure the existing cache value is used when the cache was not invalidated.
                        } else if (subTreeData === null) {
                            mutable.useExistingCache = true;
                        }
                        const canonicalUrlOverrideHref = canonicalUrlOverride ? (0, _createHrefFromUrl).createHrefFromUrl(canonicalUrlOverride) : undefined;
                        if (canonicalUrlOverrideHref) {
                            mutable.canonicalUrlOverride = canonicalUrlOverrideHref;
                        }
                        return {
                            // Set href.
                            canonicalUrl: canonicalUrlOverrideHref ? canonicalUrlOverrideHref : href,
                            // Set pendingPush.
                            pushRef: {
                                pendingPush,
                                mpaNavigation: false
                            },
                            // All navigation requires scroll and focus management to trigger.
                            focusAndScrollRef: {
                                apply: true
                            },
                            // Apply patched cache.
                            cache: mutable.useExistingCache ? state.cache : cache,
                            prefetchCache: state.prefetchCache,
                            // Apply patched tree.
                            tree: newTree
                        };
                    }
                }
                // When doing a hard push there can be two cases: with optimistic tree and without
                // The with optimistic tree case only happens when the layouts have a loading state (loading.js)
                // The without optimistic tree case happens when there is no loading state, in that case we suspend in this reducer
                // forceOptimisticNavigation is used for links that have `prefetch={false}`.
                if (forceOptimisticNavigation) {
                    const segments = pathname.split('/');
                    // TODO-APP: figure out something better for index pages
                    segments.push('');
                    // Optimistic tree case.
                    // If the optimistic tree is deeper than the current state leave that deeper part out of the fetch
                    const optimisticTree = (0, _createOptimisticTree).createOptimisticTree(segments, state.tree, false);
                    // Copy subTreeData for the root node of the cache.
                    cache.status = _appRouterContext.CacheStates.READY;
                    cache.subTreeData = state.cache.subTreeData;
                    // Copy existing cache nodes as far as possible and fill in `data` property with the started data fetch.
                    // The `data` property is used to suspend in layout-router during render if it hasn't resolved yet by the time it renders.
                    const res = (0, _fillCacheWithDataProperty).fillCacheWithDataProperty(cache, state.cache, // TODO-APP: segments.slice(1) strips '', we can get rid of '' altogether.
                    segments.slice(1), ()=>(0, _fetchServerResponse).fetchServerResponse(url, optimisticTree));
                    // If optimistic fetch couldn't happen it falls back to the non-optimistic case.
                    if (!(res == null ? void 0 : res.bailOptimistic)) {
                        mutable.previousTree = state.tree;
                        mutable.patchedTree = optimisticTree;
                        mutable.mpaNavigation = (0, _isNavigatingToNewRootLayout).isNavigatingToNewRootLayout(state.tree, optimisticTree);
                        return {
                            // Set href.
                            canonicalUrl: href,
                            // Set pendingPush.
                            pushRef: {
                                pendingPush,
                                mpaNavigation: false
                            },
                            // All navigation requires scroll and focus management to trigger.
                            focusAndScrollRef: {
                                apply: true
                            },
                            // Apply patched cache.
                            cache: cache,
                            prefetchCache: state.prefetchCache,
                            // Apply optimistic tree.
                            tree: optimisticTree
                        };
                    }
                }
                // Below is the not-optimistic case. Data is fetched at the root and suspended there without a suspense boundary.
                // If no in-flight fetch at the top, start it.
                if (!cache.data) {
                    cache.data = (0, _createRecordFromThenable).createRecordFromThenable((0, _fetchServerResponse).fetchServerResponse(url, state.tree));
                }
                // Unwrap cache data with `use` to suspend here (in the reducer) until the fetch resolves.
                const [flightData, canonicalUrlOverride] = (0, _readRecordValue).readRecordValue(cache.data);
                // Handle case when navigating to page in `pages` from `app`
                if (typeof flightData === 'string') {
                    return {
                        canonicalUrl: flightData,
                        // Enable mpaNavigation
                        pushRef: {
                            pendingPush: true,
                            mpaNavigation: true
                        },
                        // Don't apply scroll and focus management.
                        focusAndScrollRef: {
                            apply: false
                        },
                        cache: state.cache,
                        prefetchCache: state.prefetchCache,
                        tree: state.tree
                    };
                }
                // Remove cache.data as it has been resolved at this point.
                cache.data = null;
                // TODO-APP: Currently the Flight data can only have one item but in the future it can have multiple paths.
                const flightDataPath = flightData[0];
                // The one before last item is the router state tree patch
                const [treePatch, subTreeData, head] = flightDataPath.slice(-3);
                // Path without the last segment, router state, and the subTreeData
                const flightSegmentPath = flightDataPath.slice(0, -4);
                // Create new tree based on the flightSegmentPath and router state patch
                const newTree = (0, _applyRouterStatePatchToTree).applyRouterStatePatchToTree(// TODO-APP: remove ''
                [
                    '',
                    ...flightSegmentPath
                ], state.tree, treePatch);
                if (newTree === null) {
                    throw new Error('SEGMENT MISMATCH');
                }
                const canonicalUrlOverrideHref = canonicalUrlOverride ? (0, _createHrefFromUrl).createHrefFromUrl(canonicalUrlOverride) : undefined;
                if (canonicalUrlOverrideHref) {
                    mutable.canonicalUrlOverride = canonicalUrlOverrideHref;
                }
                mutable.previousTree = state.tree;
                mutable.patchedTree = newTree;
                mutable.mpaNavigation = (0, _isNavigatingToNewRootLayout).isNavigatingToNewRootLayout(state.tree, newTree);
                if (flightDataPath.length === 3) {
                    cache.status = _appRouterContext.CacheStates.READY;
                    cache.subTreeData = subTreeData;
                    (0, _fillLazyItemsTillLeafWithHead).fillLazyItemsTillLeafWithHead(cache, state.cache, treePatch, head);
                } else {
                    // Copy subTreeData for the root node of the cache.
                    cache.status = _appRouterContext.CacheStates.READY;
                    cache.subTreeData = state.cache.subTreeData;
                    // Create a copy of the existing cache with the subTreeData applied.
                    (0, _fillCacheWithNewSubtreeData).fillCacheWithNewSubTreeData(cache, state.cache, flightDataPath);
                }
                return {
                    // Set href.
                    canonicalUrl: canonicalUrlOverrideHref ? canonicalUrlOverrideHref : href,
                    // Set pendingPush.
                    pushRef: {
                        pendingPush,
                        mpaNavigation: false
                    },
                    // All navigation requires scroll and focus management to trigger.
                    focusAndScrollRef: {
                        apply: true
                    },
                    // Apply patched cache.
                    cache: cache,
                    prefetchCache: state.prefetchCache,
                    // Apply patched tree.
                    tree: newTree
                };
            }
        case ACTION_SERVER_PATCH:
            {
                const { flightData , previousTree , overrideCanonicalUrl , cache , mutable  } = action;
                // When a fetch is slow to resolve it could be that you navigated away while the request was happening or before the reducer runs.
                // In that case opt-out of applying the patch given that the data could be stale.
                if (JSON.stringify(previousTree) !== JSON.stringify(state.tree)) {
                    // TODO-APP: Handle tree mismatch
                    console.log('TREE MISMATCH');
                    // Keep everything as-is.
                    return state;
                }
                if (mutable.mpaNavigation) {
                    return {
                        // Set href.
                        canonicalUrl: mutable.canonicalUrlOverride ? mutable.canonicalUrlOverride : state.canonicalUrl,
                        // TODO-APP: verify mpaNavigation not being set is correct here.
                        pushRef: {
                            pendingPush: true,
                            mpaNavigation: mutable.mpaNavigation
                        },
                        // All navigation requires scroll and focus management to trigger.
                        focusAndScrollRef: {
                            apply: false
                        },
                        // Apply cache.
                        cache: state.cache,
                        prefetchCache: state.prefetchCache,
                        // Apply patched router state.
                        tree: state.tree
                    };
                }
                // Handle concurrent rendering / strict mode case where the cache and tree were already populated.
                if (mutable.patchedTree) {
                    return {
                        // Keep href as it was set during navigate / restore
                        canonicalUrl: mutable.canonicalUrlOverride ? mutable.canonicalUrlOverride : state.canonicalUrl,
                        // Keep pushRef as server-patch only causes cache/tree update.
                        pushRef: state.pushRef,
                        // Keep focusAndScrollRef as server-patch only causes cache/tree update.
                        focusAndScrollRef: state.focusAndScrollRef,
                        // Apply patched router state
                        tree: mutable.patchedTree,
                        prefetchCache: state.prefetchCache,
                        // Apply patched cache
                        cache: cache
                    };
                }
                // Handle case when navigating to page in `pages` from `app`
                if (typeof flightData === 'string') {
                    return {
                        // Set href.
                        canonicalUrl: flightData,
                        // Enable mpaNavigation as this is a navigation that the app-router shouldn't handle.
                        pushRef: {
                            pendingPush: true,
                            mpaNavigation: true
                        },
                        // Don't apply scroll and focus management.
                        focusAndScrollRef: {
                            apply: false
                        },
                        // Other state is kept as-is.
                        cache: state.cache,
                        prefetchCache: state.prefetchCache,
                        tree: state.tree
                    };
                }
                // TODO-APP: Currently the Flight data can only have one item but in the future it can have multiple paths.
                const flightDataPath = flightData[0];
                // Slices off the last segment (which is at -4) as it doesn't exist in the tree yet
                const flightSegmentPath = flightDataPath.slice(0, -4);
                const [treePatch, subTreeData, head] = flightDataPath.slice(-3);
                const newTree = (0, _applyRouterStatePatchToTree).applyRouterStatePatchToTree(// TODO-APP: remove ''
                [
                    '',
                    ...flightSegmentPath
                ], state.tree, treePatch);
                if (newTree === null) {
                    throw new Error('SEGMENT MISMATCH');
                }
                const canonicalUrlOverrideHref = overrideCanonicalUrl ? (0, _createHrefFromUrl).createHrefFromUrl(overrideCanonicalUrl) : undefined;
                if (canonicalUrlOverrideHref) {
                    mutable.canonicalUrlOverride = canonicalUrlOverrideHref;
                }
                mutable.patchedTree = newTree;
                mutable.mpaNavigation = (0, _isNavigatingToNewRootLayout).isNavigatingToNewRootLayout(state.tree, newTree);
                // Root refresh
                if (flightDataPath.length === 3) {
                    cache.status = _appRouterContext.CacheStates.READY;
                    cache.subTreeData = subTreeData;
                    (0, _fillLazyItemsTillLeafWithHead).fillLazyItemsTillLeafWithHead(cache, state.cache, treePatch, head);
                } else {
                    // Copy subTreeData for the root node of the cache.
                    cache.status = _appRouterContext.CacheStates.READY;
                    cache.subTreeData = state.cache.subTreeData;
                    (0, _fillCacheWithNewSubtreeData).fillCacheWithNewSubTreeData(cache, state.cache, flightDataPath);
                }
                return {
                    // Keep href as it was set during navigate / restore
                    canonicalUrl: canonicalUrlOverrideHref ? canonicalUrlOverrideHref : state.canonicalUrl,
                    // Keep pushRef as server-patch only causes cache/tree update.
                    pushRef: state.pushRef,
                    // Keep focusAndScrollRef as server-patch only causes cache/tree update.
                    focusAndScrollRef: state.focusAndScrollRef,
                    // Apply patched router state
                    tree: newTree,
                    prefetchCache: state.prefetchCache,
                    // Apply patched cache
                    cache: cache
                };
            }
        case ACTION_RESTORE:
            {
                const { url , tree  } = action;
                const href = (0, _createHrefFromUrl).createHrefFromUrl(url);
                return {
                    // Set canonical url
                    canonicalUrl: href,
                    pushRef: state.pushRef,
                    focusAndScrollRef: state.focusAndScrollRef,
                    cache: state.cache,
                    prefetchCache: state.prefetchCache,
                    // Restore provided tree
                    tree: tree
                };
            }
        case ACTION_REFRESH:
            {
                const { cache , mutable  } = action;
                const href = state.canonicalUrl;
                const isForCurrentTree = JSON.stringify(mutable.previousTree) === JSON.stringify(state.tree);
                if (mutable.mpaNavigation && isForCurrentTree) {
                    return {
                        // Set href.
                        canonicalUrl: mutable.canonicalUrlOverride ? mutable.canonicalUrlOverride : state.canonicalUrl,
                        // TODO-APP: verify mpaNavigation not being set is correct here.
                        pushRef: {
                            pendingPush: true,
                            mpaNavigation: mutable.mpaNavigation
                        },
                        // All navigation requires scroll and focus management to trigger.
                        focusAndScrollRef: {
                            apply: false
                        },
                        // Apply cache.
                        cache: state.cache,
                        prefetchCache: state.prefetchCache,
                        // Apply patched router state.
                        tree: state.tree
                    };
                }
                // Handle concurrent rendering / strict mode case where the cache and tree were already populated.
                if (mutable.patchedTree && isForCurrentTree) {
                    return {
                        // Set href.
                        canonicalUrl: mutable.canonicalUrlOverride ? mutable.canonicalUrlOverride : href,
                        // set pendingPush (always false in this case).
                        pushRef: state.pushRef,
                        // Apply focus and scroll.
                        // TODO-APP: might need to disable this for Fast Refresh.
                        focusAndScrollRef: {
                            apply: false
                        },
                        cache: cache,
                        prefetchCache: state.prefetchCache,
                        tree: mutable.patchedTree
                    };
                }
                if (!cache.data) {
                    // Fetch data from the root of the tree.
                    cache.data = (0, _createRecordFromThenable).createRecordFromThenable((0, _fetchServerResponse).fetchServerResponse(new URL(href, location.origin), [
                        state.tree[0],
                        state.tree[1],
                        state.tree[2],
                        'refetch', 
                    ]));
                }
                const [flightData, canonicalUrlOverride] = (0, _readRecordValue).readRecordValue(cache.data);
                // Handle case when navigating to page in `pages` from `app`
                if (typeof flightData === 'string') {
                    return {
                        canonicalUrl: flightData,
                        pushRef: {
                            pendingPush: true,
                            mpaNavigation: true
                        },
                        focusAndScrollRef: {
                            apply: false
                        },
                        cache: state.cache,
                        prefetchCache: state.prefetchCache,
                        tree: state.tree
                    };
                }
                // Remove cache.data as it has been resolved at this point.
                cache.data = null;
                // TODO-APP: Currently the Flight data can only have one item but in the future it can have multiple paths.
                const flightDataPath = flightData[0];
                // FlightDataPath with more than two items means unexpected Flight data was returned
                if (flightDataPath.length !== 3) {
                    // TODO-APP: handle this case better
                    console.log('REFRESH FAILED');
                    return state;
                }
                // Given the path can only have two items the items are only the router state and subTreeData for the root.
                const [treePatch, subTreeData, head] = flightDataPath;
                const newTree = (0, _applyRouterStatePatchToTree).applyRouterStatePatchToTree(// TODO-APP: remove ''
                [
                    ''
                ], state.tree, treePatch);
                if (newTree === null) {
                    throw new Error('SEGMENT MISMATCH');
                }
                const canonicalUrlOverrideHref = canonicalUrlOverride ? (0, _createHrefFromUrl).createHrefFromUrl(canonicalUrlOverride) : undefined;
                if (canonicalUrlOverride) {
                    mutable.canonicalUrlOverride = canonicalUrlOverrideHref;
                }
                mutable.previousTree = state.tree;
                mutable.patchedTree = newTree;
                mutable.mpaNavigation = (0, _isNavigatingToNewRootLayout).isNavigatingToNewRootLayout(state.tree, newTree);
                // Set subTreeData for the root node of the cache.
                cache.status = _appRouterContext.CacheStates.READY;
                cache.subTreeData = subTreeData;
                (0, _fillLazyItemsTillLeafWithHead).fillLazyItemsTillLeafWithHead(cache, state.cache, treePatch, head);
                return {
                    // Set href, this doesn't reuse the state.canonicalUrl as because of concurrent rendering the href might change between dispatching and applying.
                    canonicalUrl: canonicalUrlOverrideHref ? canonicalUrlOverrideHref : href,
                    // set pendingPush (always false in this case).
                    pushRef: state.pushRef,
                    // TODO-APP: might need to disable this for Fast Refresh.
                    focusAndScrollRef: {
                        apply: false
                    },
                    // Apply patched cache.
                    cache: cache,
                    prefetchCache: state.prefetchCache,
                    // Apply patched router state.
                    tree: newTree
                };
            }
        case ACTION_PREFETCH:
            {
                const { url , serverResponse  } = action;
                const [flightData, canonicalUrlOverride] = serverResponse;
                if (typeof flightData === 'string') {
                    return state;
                }
                const href = (0, _createHrefFromUrl).createHrefFromUrl(url);
                // TODO-APP: Currently the Flight data can only have one item but in the future it can have multiple paths.
                const flightDataPath = flightData[0];
                // The one before last item is the router state tree patch
                const [treePatch] = flightDataPath.slice(-3);
                const flightSegmentPath = flightDataPath.slice(0, -3);
                const newTree = (0, _applyRouterStatePatchToTree).applyRouterStatePatchToTree(// TODO-APP: remove ''
                [
                    '',
                    ...flightSegmentPath
                ], state.tree, treePatch);
                // Patch did not apply correctly
                if (newTree === null) {
                    return state;
                }
                // Create new tree based on the flightSegmentPath and router state patch
                state.prefetchCache.set(href, {
                    flightData,
                    // Create new tree based on the flightSegmentPath and router state patch
                    tree: newTree,
                    canonicalUrlOverride
                });
                return state;
            }
        // This case should never be hit as dispatch is strongly typed.
        default:
            throw new Error('Unknown action');
    }
}
function serverReducer(state, _action) {
    return state;
}
const reducer = typeof window === 'undefined' ? serverReducer : clientReducer;
exports.reducer = reducer;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=router-reducer.js.map
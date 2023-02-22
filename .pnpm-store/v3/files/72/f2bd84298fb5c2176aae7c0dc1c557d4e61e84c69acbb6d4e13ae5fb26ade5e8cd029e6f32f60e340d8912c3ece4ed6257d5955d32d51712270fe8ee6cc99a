"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createInitialRouterState = createInitialRouterState;
var _appRouterContext = require("../../../shared/lib/app-router-context");
var _createHrefFromUrl = require("./create-href-from-url");
function createInitialRouterState({ initialTree , children , initialCanonicalUrl , initialParallelRoutes  }) {
    return {
        tree: initialTree,
        cache: {
            status: _appRouterContext.CacheStates.READY,
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
        typeof window !== 'undefined' ? (0, _createHrefFromUrl).createHrefFromUrl(window.location) : initialCanonicalUrl
    };
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=create-initial-router-state.js.map
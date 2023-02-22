"use strict";
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _react = _interop_require_default(require("react"));
var _invalidateCacheByRouterState = require("./invalidate-cache-by-router-state");
var _appRouterContext = require("../../../shared/lib/app-router-context");
describe('invalidateCacheByRouterState', ()=>{
    it('should invalidate the cache by router state', ()=>{
        const cache = {
            status: _appRouterContext.CacheStates.LAZY_INITIALIZED,
            data: null,
            subTreeData: null,
            parallelRoutes: new Map()
        };
        const existingCache = {
            data: null,
            status: _appRouterContext.CacheStates.READY,
            subTreeData: /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, "Root layout"),
            parallelRoutes: new Map([
                [
                    'children',
                    new Map([
                        [
                            'linking',
                            {
                                data: null,
                                status: _appRouterContext.CacheStates.READY,
                                subTreeData: /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, "Linking"),
                                parallelRoutes: new Map([
                                    [
                                        'children',
                                        new Map([
                                            [
                                                '',
                                                {
                                                    data: null,
                                                    status: _appRouterContext.CacheStates.READY,
                                                    subTreeData: /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, "Page"),
                                                    parallelRoutes: new Map()
                                                }, 
                                            ], 
                                        ]), 
                                    ], 
                                ])
                            }, 
                        ], 
                    ]), 
                ], 
            ])
        };
        const routerState = [
            '',
            {
                children: [
                    'linking',
                    {
                        children: [
                            'about',
                            {
                                children: [
                                    '',
                                    {}
                                ]
                            }, 
                        ]
                    }, 
                ]
            },
            null,
            null,
            true, 
        ];
        (0, _invalidateCacheByRouterState).invalidateCacheByRouterState(cache, existingCache, routerState);
        const expectedCache = {
            data: null,
            status: _appRouterContext.CacheStates.LAZY_INITIALIZED,
            subTreeData: null,
            parallelRoutes: new Map([
                [
                    'children',
                    new Map()
                ]
            ])
        };
        expect(cache).toMatchObject(expectedCache);
    });
});

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=invalidate-cache-by-router-state.test.js.map
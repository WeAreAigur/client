"use strict";
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _react = _interop_require_default(require("react"));
var _invalidateCacheBelowFlightSegmentpath = require("./invalidate-cache-below-flight-segmentpath");
var _appRouterContext = require("../../../shared/lib/app-router-context");
var _fillCacheWithNewSubtreeData = require("./fill-cache-with-new-subtree-data");
const getFlightData = ()=>{
    return [
        [
            'children',
            'linking',
            'children',
            'about',
            [
                'about',
                {
                    children: [
                        '',
                        {}
                    ]
                }, 
            ],
            /*#__PURE__*/ _react.default.createElement("h1", null, "About Page!"),
            /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("title", null, "About page!")), 
        ], 
    ];
};
describe('invalidateCacheBelowFlightSegmentPath', ()=>{
    it('should invalidate cache below flight segment path', ()=>{
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
        const flightData = getFlightData();
        if (typeof flightData === 'string') {
            throw new Error('invalid flight data');
        }
        // Mirrors the way router-reducer values are passed in.
        const flightDataPath = flightData[0];
        const flightSegmentPath = flightDataPath.slice(0, -3);
        // @ts-expect-error TODO-APP: investigate why this is not a TS error in router-reducer.
        cache.status = _appRouterContext.CacheStates.READY;
        // Copy subTreeData for the root node of the cache.
        // @ts-expect-error TODO-APP: investigate why this is not a TS error in router-reducer.
        cache.subTreeData = existingCache.subTreeData;
        // Create a copy of the existing cache with the subTreeData applied.
        (0, _fillCacheWithNewSubtreeData).fillCacheWithNewSubTreeData(cache, existingCache, flightDataPath);
        // Invalidate the cache below the flight segment path. This should remove the 'about' node.
        (0, _invalidateCacheBelowFlightSegmentpath).invalidateCacheBelowFlightSegmentPath(cache, existingCache, flightSegmentPath);
        const expectedCache = {
            data: null,
            parallelRoutes: new Map([
                [
                    'children',
                    new Map([
                        [
                            'linking',
                            {
                                data: null,
                                parallelRoutes: new Map([
                                    [
                                        'children',
                                        new Map([
                                            [
                                                '',
                                                {
                                                    data: null,
                                                    parallelRoutes: new Map(),
                                                    status: _appRouterContext.CacheStates.READY,
                                                    subTreeData: /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, "Page")
                                                }, 
                                            ], 
                                        ]), 
                                    ], 
                                ]),
                                status: _appRouterContext.CacheStates.READY,
                                subTreeData: /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, "Linking")
                            }, 
                        ], 
                    ]), 
                ], 
            ]),
            status: _appRouterContext.CacheStates.READY,
            subTreeData: /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, "Root layout")
        };
        expect(cache).toMatchObject(expectedCache);
    });
});

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=invalidate-cache-below-flight-segmentpath.test.js.map
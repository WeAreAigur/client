"use strict";
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _react = _interop_require_default(require("react"));
var _fillCacheWithNewSubtreeData = require("./fill-cache-with-new-subtree-data");
var _appRouterContext = require("../../../shared/lib/app-router-context");
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
            /*#__PURE__*/ _react.default.createElement("h1", null, "SubTreeData Injected!"),
            /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("title", null, "Head Injected!")), 
        ], 
    ];
};
describe('fillCacheWithNewSubtreeData', ()=>{
    it('should apply subTreeData and head property', ()=>{
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
        (0, _fillCacheWithNewSubtreeData).fillCacheWithNewSubTreeData(cache, existingCache, flightDataPath);
        const expectedCache = {
            data: null,
            status: _appRouterContext.CacheStates.LAZY_INITIALIZED,
            subTreeData: null,
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
                                            // TODO-APP: this segment should be preserved when creating the new cache
                                            [
                                                '',
                                                {
                                                    data: null,
                                                    status: _appRouterContext.CacheStates.READY,
                                                    subTreeData: /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, "Page"),
                                                    parallelRoutes: new Map()
                                                }, 
                                            ],
                                            [
                                                'about',
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
                                                                        status: _appRouterContext.CacheStates.LAZY_INITIALIZED,
                                                                        subTreeData: null,
                                                                        parallelRoutes: new Map(),
                                                                        head: /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("title", null, "Head Injected!"))
                                                                    }, 
                                                                ], 
                                                            ]), 
                                                        ], 
                                                    ]),
                                                    subTreeData: /*#__PURE__*/ _react.default.createElement("h1", null, "SubTreeData Injected!"),
                                                    status: _appRouterContext.CacheStates.READY
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
        expect(cache).toMatchObject(expectedCache);
    });
});

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=fill-cache-with-new-subtree-data.test.js.map
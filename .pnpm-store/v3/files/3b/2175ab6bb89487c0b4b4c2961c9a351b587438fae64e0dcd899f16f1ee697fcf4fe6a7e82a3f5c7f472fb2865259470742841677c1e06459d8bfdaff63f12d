"use strict";
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _react = _interop_require_default(require("react"));
var _fillLazyItemsTillLeafWithHead = require("./fill-lazy-items-till-leaf-with-head");
var _appRouterContext = require("../../../shared/lib/app-router-context");
const getFlightData = ()=>{
    return [
        [
            [
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
            ],
            /*#__PURE__*/ _react.default.createElement("h1", null, "About Page!"),
            /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("title", null, "About page!")), 
        ], 
    ];
};
describe('fillLazyItemsTillLeafWithHead', ()=>{
    it('should fill lazy items till leaf with head', ()=>{
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [treePatch, _subTreeData, head] = flightDataPath.slice(-3);
        (0, _fillLazyItemsTillLeafWithHead).fillLazyItemsTillLeafWithHead(cache, existingCache, treePatch, head);
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
                                status: _appRouterContext.CacheStates.LAZY_INITIALIZED,
                                subTreeData: null,
                                parallelRoutes: new Map([
                                    [
                                        'children',
                                        new Map([
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
                                                                        head: /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("title", null, "About page!"))
                                                                    }, 
                                                                ], 
                                                            ]), 
                                                        ], 
                                                    ]),
                                                    subTreeData: null,
                                                    status: _appRouterContext.CacheStates.LAZY_INITIALIZED
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

//# sourceMappingURL=fill-lazy-items-till-leaf-with-head.test.js.map
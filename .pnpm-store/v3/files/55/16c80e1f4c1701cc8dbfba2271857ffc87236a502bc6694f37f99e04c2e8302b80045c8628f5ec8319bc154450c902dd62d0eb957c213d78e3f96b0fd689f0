"use strict";
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _react = _interop_require_default(require("react"));
var _fillCacheWithDataProperty = require("./fill-cache-with-data-property");
var _appRouterContext = require("../../../shared/lib/app-router-context");
describe('fillCacheWithDataProperty', ()=>{
    it('should add data property', ()=>{
        const fetchServerResponseMock = jest.fn(()=>Promise.resolve([
                /* TODO-APP: replace with actual FlightData */ '',
                undefined, 
            ]));
        const pathname = '/dashboard/settings';
        const segments = pathname.split('/');
        // TODO-APP: figure out something better for index pages
        segments.push('');
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
        (0, _fillCacheWithDataProperty).fillCacheWithDataProperty(cache, existingCache, segments, ()=>fetchServerResponseMock());
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
                        [
                            '',
                            {
                                data: fetchServerResponseMock(),
                                parallelRoutes: new Map(),
                                status: _appRouterContext.CacheStates.DATA_FETCH,
                                subTreeData: null
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

//# sourceMappingURL=fill-cache-with-data-property.test.js.map
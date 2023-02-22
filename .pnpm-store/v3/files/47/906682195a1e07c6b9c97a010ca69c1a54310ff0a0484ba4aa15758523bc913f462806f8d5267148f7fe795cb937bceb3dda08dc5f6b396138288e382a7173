"use strict";
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _react = _interop_require_default(require("react"));
var _shouldHardNavigate = require("./should-hard-navigate");
describe('shouldHardNavigate', ()=>{
    it('should return false if the segments match', ()=>{
        const getInitialRouterStateTree = ()=>[
                '',
                {
                    children: [
                        'linking',
                        {
                            children: [
                                '',
                                {}
                            ]
                        }, 
                    ]
                },
                undefined,
                undefined,
                true, 
            ];
        const initialRouterStateTree = getInitialRouterStateTree();
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
        const flightData = getFlightData();
        if (typeof flightData === 'string') {
            throw new Error('invalid flight data');
        }
        // Mirrors the way router-reducer values are passed in.
        const flightDataPath = flightData[0];
        const flightSegmentPath = flightDataPath.slice(0, -3);
        const result = (0, _shouldHardNavigate).shouldHardNavigate([
            '',
            ...flightSegmentPath
        ], initialRouterStateTree);
        expect(result).toBe(false);
    });
    it('should return false if segments are dynamic and match', ()=>{
        const getInitialRouterStateTree = ()=>[
                '',
                {
                    children: [
                        'link-hard-push',
                        {
                            children: [
                                [
                                    'id',
                                    '123',
                                    'd'
                                ],
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
        const initialRouterStateTree = getInitialRouterStateTree();
        const getFlightData = ()=>{
            return [
                [
                    'children',
                    'link-hard-push',
                    'children',
                    [
                        'id',
                        '123',
                        'd'
                    ],
                    [
                        [
                            'id',
                            '123',
                            'd'
                        ],
                        {
                            children: [
                                '',
                                {}
                            ]
                        }, 
                    ],
                    null,
                    null, 
                ], 
            ];
        };
        const flightData = getFlightData();
        if (typeof flightData === 'string') {
            throw new Error('invalid flight data');
        }
        // Mirrors the way router-reducer values are passed in.
        const flightDataPath = flightData[0];
        const flightSegmentPath = flightDataPath.slice(0, -3);
        const result = (0, _shouldHardNavigate).shouldHardNavigate([
            '',
            ...flightSegmentPath
        ], initialRouterStateTree);
        expect(result).toBe(false);
    });
    it('should return true if segments are dynamic and mismatch', ()=>{
        const getInitialRouterStateTree = ()=>[
                '',
                {
                    children: [
                        'link-hard-push',
                        {
                            children: [
                                [
                                    'id',
                                    '456',
                                    'd'
                                ],
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
        const initialRouterStateTree = getInitialRouterStateTree();
        const getFlightData = ()=>{
            return [
                [
                    'children',
                    'link-hard-push',
                    'children',
                    [
                        'id',
                        '123',
                        'd'
                    ],
                    [
                        [
                            'id',
                            '123',
                            'd'
                        ],
                        {
                            children: [
                                '',
                                {}
                            ]
                        }, 
                    ],
                    null,
                    null, 
                ], 
            ];
        };
        const flightData = getFlightData();
        if (typeof flightData === 'string') {
            throw new Error('invalid flight data');
        }
        // Mirrors the way router-reducer values are passed in.
        const flightDataPath = flightData[0];
        const flightSegmentPath = flightDataPath.slice(0, -3);
        const result = (0, _shouldHardNavigate).shouldHardNavigate([
            '',
            ...flightSegmentPath
        ], initialRouterStateTree);
        expect(result).toBe(true);
    });
});

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=should-hard-navigate.test.js.map
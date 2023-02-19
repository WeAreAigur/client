"use strict";
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _react = _interop_require_default(require("react"));
var _applyRouterStatePatchToTree = require("./apply-router-state-patch-to-tree");
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
describe('applyRouterStatePatchToTree', ()=>{
    it('should apply a patch to the tree', ()=>{
        const initialRouterStateTree = getInitialRouterStateTree();
        const flightData = getFlightData();
        if (typeof flightData === 'string') {
            throw new Error('invalid flight data');
        }
        // Mirrors the way router-reducer values are passed in.
        const flightDataPath = flightData[0];
        const [treePatch /*, subTreeData, head*/ ] = flightDataPath.slice(-3);
        const flightSegmentPath = flightDataPath.slice(0, -4);
        const newRouterStateTree = (0, _applyRouterStatePatchToTree).applyRouterStatePatchToTree([
            '',
            ...flightSegmentPath
        ], initialRouterStateTree, treePatch);
        expect(newRouterStateTree).toMatchObject([
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
            undefined,
            undefined,
            true, 
        ]);
    });
});

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=apply-router-state-patch-to-tree.test.js.map
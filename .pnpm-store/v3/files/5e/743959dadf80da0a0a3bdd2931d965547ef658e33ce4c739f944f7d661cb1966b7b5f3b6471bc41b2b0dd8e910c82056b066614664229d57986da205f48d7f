"use strict";
var _isNavigatingToNewRootLayout = require("./is-navigating-to-new-root-layout");
describe('shouldHardNavigate', ()=>{
    it('should return false if there is no new root layout', ()=>{
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
        const getNewRouterStateTree = ()=>{
            return [
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
        };
        const newRouterState = getNewRouterStateTree();
        const result = (0, _isNavigatingToNewRootLayout).isNavigatingToNewRootLayout(newRouterState, initialRouterStateTree);
        expect(result).toBe(false);
    });
    it('should return true if there is a mismatch between the root layouts', ()=>{
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
                        undefined,
                        undefined,
                        // Root layout at `linking` level.
                        true, 
                    ]
                }, 
            ];
        const initialRouterStateTree = getInitialRouterStateTree();
        const getNewRouterStateTree = ()=>{
            return [
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
                        null,
                        null,
                        // Root layout at `link-hard-push` level.
                        true, 
                    ]
                }, 
            ];
        };
        const newRouterState = getNewRouterStateTree();
        const result = (0, _isNavigatingToNewRootLayout).isNavigatingToNewRootLayout(newRouterState, initialRouterStateTree);
        expect(result).toBe(true);
    });
});

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=is-navigating-to-new-root-layout.test.js.map
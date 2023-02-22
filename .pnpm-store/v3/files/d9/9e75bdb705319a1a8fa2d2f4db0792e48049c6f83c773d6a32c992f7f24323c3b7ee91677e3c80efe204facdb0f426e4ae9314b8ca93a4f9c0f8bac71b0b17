"use strict";
var _createOptimisticTree = require("./create-optimistic-tree");
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
describe('createOptimisticTree', ()=>{
    it('should create an optimistic tree', ()=>{
        const initialRouterStateTree = getInitialRouterStateTree();
        const pathname = '/dashboard/settings';
        const segments = pathname.split('/');
        // TODO-APP: figure out something better for index pages
        segments.push('');
        const result = (0, _createOptimisticTree).createOptimisticTree(segments, initialRouterStateTree, false);
        expect(result).toMatchObject([
            '',
            {
                children: [
                    'dashboard',
                    {
                        children: [
                            'settings',
                            {
                                children: [
                                    '',
                                    {}
                                ]
                            }, 
                        ]
                    },
                    undefined,
                    'refetch', 
                ]
            }, 
        ]);
    });
});

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=create-optimistic-tree.test.js.map
import React from 'react';
import { applyRouterStatePatchToTree } from './apply-router-state-patch-to-tree';
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
            /*#__PURE__*/ React.createElement("h1", null, "About Page!"),
            /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("title", null, "About page!")), 
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
        const newRouterStateTree = applyRouterStatePatchToTree([
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

//# sourceMappingURL=apply-router-state-patch-to-tree.test.js.map
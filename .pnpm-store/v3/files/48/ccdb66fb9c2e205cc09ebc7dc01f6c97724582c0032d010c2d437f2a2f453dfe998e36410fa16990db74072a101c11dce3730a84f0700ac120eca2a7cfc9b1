import React from 'react';
import { fillLazyItemsTillLeafWithHead } from './fill-lazy-items-till-leaf-with-head';
import { CacheStates } from '../../../shared/lib/app-router-context';
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
            /*#__PURE__*/ React.createElement("h1", null, "About Page!"),
            /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("title", null, "About page!")), 
        ], 
    ];
};
describe('fillLazyItemsTillLeafWithHead', ()=>{
    it('should fill lazy items till leaf with head', ()=>{
        const cache = {
            status: CacheStates.LAZY_INITIALIZED,
            data: null,
            subTreeData: null,
            parallelRoutes: new Map()
        };
        const existingCache = {
            data: null,
            status: CacheStates.READY,
            subTreeData: /*#__PURE__*/ React.createElement(React.Fragment, null, "Root layout"),
            parallelRoutes: new Map([
                [
                    'children',
                    new Map([
                        [
                            'linking',
                            {
                                data: null,
                                status: CacheStates.READY,
                                subTreeData: /*#__PURE__*/ React.createElement(React.Fragment, null, "Linking"),
                                parallelRoutes: new Map([
                                    [
                                        'children',
                                        new Map([
                                            [
                                                '',
                                                {
                                                    data: null,
                                                    status: CacheStates.READY,
                                                    subTreeData: /*#__PURE__*/ React.createElement(React.Fragment, null, "Page"),
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
        fillLazyItemsTillLeafWithHead(cache, existingCache, treePatch, head);
        const expectedCache = {
            data: null,
            status: CacheStates.LAZY_INITIALIZED,
            subTreeData: null,
            parallelRoutes: new Map([
                [
                    'children',
                    new Map([
                        [
                            'linking',
                            {
                                data: null,
                                status: CacheStates.LAZY_INITIALIZED,
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
                                                                        status: CacheStates.LAZY_INITIALIZED,
                                                                        subTreeData: null,
                                                                        parallelRoutes: new Map(),
                                                                        head: /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("title", null, "About page!"))
                                                                    }, 
                                                                ], 
                                                            ]), 
                                                        ], 
                                                    ]),
                                                    subTreeData: null,
                                                    status: CacheStates.LAZY_INITIALIZED
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

//# sourceMappingURL=fill-lazy-items-till-leaf-with-head.test.js.map
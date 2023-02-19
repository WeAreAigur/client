import React from 'react';
import { invalidateCacheBelowFlightSegmentPath } from './invalidate-cache-below-flight-segmentpath';
import { CacheStates } from '../../../shared/lib/app-router-context';
import { fillCacheWithNewSubTreeData } from './fill-cache-with-new-subtree-data';
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
describe('invalidateCacheBelowFlightSegmentPath', ()=>{
    it('should invalidate cache below flight segment path', ()=>{
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
        const flightSegmentPath = flightDataPath.slice(0, -3);
        // @ts-expect-error TODO-APP: investigate why this is not a TS error in router-reducer.
        cache.status = CacheStates.READY;
        // Copy subTreeData for the root node of the cache.
        // @ts-expect-error TODO-APP: investigate why this is not a TS error in router-reducer.
        cache.subTreeData = existingCache.subTreeData;
        // Create a copy of the existing cache with the subTreeData applied.
        fillCacheWithNewSubTreeData(cache, existingCache, flightDataPath);
        // Invalidate the cache below the flight segment path. This should remove the 'about' node.
        invalidateCacheBelowFlightSegmentPath(cache, existingCache, flightSegmentPath);
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
                                                    status: CacheStates.READY,
                                                    subTreeData: /*#__PURE__*/ React.createElement(React.Fragment, null, "Page")
                                                }, 
                                            ], 
                                        ]), 
                                    ], 
                                ]),
                                status: CacheStates.READY,
                                subTreeData: /*#__PURE__*/ React.createElement(React.Fragment, null, "Linking")
                            }, 
                        ], 
                    ]), 
                ], 
            ]),
            status: CacheStates.READY,
            subTreeData: /*#__PURE__*/ React.createElement(React.Fragment, null, "Root layout")
        };
        expect(cache).toMatchObject(expectedCache);
    });
});

//# sourceMappingURL=invalidate-cache-below-flight-segmentpath.test.js.map
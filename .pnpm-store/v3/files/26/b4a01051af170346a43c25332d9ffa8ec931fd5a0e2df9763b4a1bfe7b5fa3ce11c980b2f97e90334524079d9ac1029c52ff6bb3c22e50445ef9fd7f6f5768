import React from 'react';
import { invalidateCacheByRouterState } from './invalidate-cache-by-router-state';
import { CacheStates } from '../../../shared/lib/app-router-context';
describe('invalidateCacheByRouterState', ()=>{
    it('should invalidate the cache by router state', ()=>{
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
        const routerState = [
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
        ];
        invalidateCacheByRouterState(cache, existingCache, routerState);
        const expectedCache = {
            data: null,
            status: CacheStates.LAZY_INITIALIZED,
            subTreeData: null,
            parallelRoutes: new Map([
                [
                    'children',
                    new Map()
                ]
            ])
        };
        expect(cache).toMatchObject(expectedCache);
    });
});

//# sourceMappingURL=invalidate-cache-by-router-state.test.js.map
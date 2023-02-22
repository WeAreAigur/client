import React from 'react';
import { fillCacheWithDataProperty } from './fill-cache-with-data-property';
import { CacheStates } from '../../../shared/lib/app-router-context';
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
        fillCacheWithDataProperty(cache, existingCache, segments, ()=>fetchServerResponseMock());
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
                        [
                            '',
                            {
                                data: fetchServerResponseMock(),
                                parallelRoutes: new Map(),
                                status: CacheStates.DATA_FETCH,
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

//# sourceMappingURL=fill-cache-with-data-property.test.js.map
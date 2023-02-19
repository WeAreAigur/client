import React from 'react';
import { shouldHardNavigate } from './should-hard-navigate';
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
                    /*#__PURE__*/ React.createElement("h1", null, "About Page!"),
                    /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("title", null, "About page!")), 
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
        const result = shouldHardNavigate([
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
        const result = shouldHardNavigate([
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
        const result = shouldHardNavigate([
            '',
            ...flightSegmentPath
        ], initialRouterStateTree);
        expect(result).toBe(true);
    });
});

//# sourceMappingURL=should-hard-navigate.test.js.map
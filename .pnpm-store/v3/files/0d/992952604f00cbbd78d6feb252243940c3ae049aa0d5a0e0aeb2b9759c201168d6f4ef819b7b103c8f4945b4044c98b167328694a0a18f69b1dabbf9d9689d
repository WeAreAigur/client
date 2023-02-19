import { createOptimisticTree } from './create-optimistic-tree';
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
        const result = createOptimisticTree(segments, initialRouterStateTree, false);
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

//# sourceMappingURL=create-optimistic-tree.test.js.map
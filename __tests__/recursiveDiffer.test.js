import { recursiveDiffer } from '../src/recursiveDiffer'

describe( 'recursiveDiffer', () => {
	it( 'Correctly represents the diff in before/after states', () => {
		const cases = [
			{
				state: {},
				newState: {
					foo: 'bar'
				},
				expect: [
					[ 'foo' ]
				]
			},
			{
				state: {
					foo: 'bar'
				},
				newState: {},
				expect: [
					[ 'foo' ]
				]
			},
			{
				state: {
					foo: 'bar',
					items: {
						123: { name: 'item123' }
					}
				},
				newState: {
					foo: 'bar',
					items: {}
				},
				expect: [
					[ 'items', '123' ]
				]
			},
			{
				state: {
					foo: 'bar',
					items: {
						123: { name: 'item123', title: 'title123' }
					}
				},
				newState: {
					foo: 'bar',
					items: {
						123: { name: 'item123' }
					}
				},
				expect: [
					[ 'items', '123', 'title' ]
				]
			},
			{
				state: {
					foo: 'bar',
					items: {
						123: { name: 'item123', title: 'title123' },
						234: { name: 'item234', title: 'title123' },
						345: { name: 'item345', title: 'title123' }
					}
				},
				newState: {
					foo: 'bar',
					items: {
						123: { name: 'item123', title: 'title123' },
						234: { name: 'item234', title: 'title123' },
						666: { name: 'item345', title: 'title666' }
					}
				},
				expect: [
					[ 'items', '345' ],
					[ 'items', '666' ]
				]
			},
			{
				state: {
					foo: 'bar',
					items: [
						{ name: 'item123', title: 'title123' },
						{ name: 'item234', title: 'title123' },
						{ name: 'item345', title: 'title123' }
					]
				},
				newState: {
					foo: 'bar',
					items: [
						// Changed order of items
						{ name: 'item234', title: 'title123' },
						{ name: 'item123', title: 'title123' },
						{ name: 'item345', title: 'title123' }
					]
				},
				expect: [
					// Potential issue: Describe a swap for the widget rather than a change
					// per widget
					[ 'items', '0', 'name' ],
					[ 'items', '1', 'name' ]
				]
			},
			{
				state: {
					foo: 'bar',
					items: {
						234: { name: 'item234', title: 'title123', isStarred: false },
						123: { name: 'item123', title: 'title123', isStarred: false },
						345: { name: 'item345', title: 'title123', isStarred: false }
					},
					starred: []
				},
				newState: {
					foo: 'bar',
					items: {
						// Changed order of items
						234: { name: 'item234', title: 'title123', isStarred: true },
						123: { name: 'item123', title: 'title123', isStarred: false },
						345: { name: 'item345', title: 'title123', isStarred: true }
					},
					starred: [ '234', '345' ]
				},
				expect: [
					[ 'items', '234', 'isStarred' ],
					[ 'items', '345', 'isStarred' ],
					[ 'starred', '0' ],
					[ 'starred', '1' ]
				]
			},
			{
				state: { items: {} },
				newState: {
					foo: 'bar',
					items: {
						123: { name: 'item123' }
					}
				},
				expect: [
					[ 'items', '123' ],
					[ 'foo' ]
				]
			},
			{
				state: { 'foo': [ 1, 2, 3 ] },
				newState: { 'foo': [ 2, 1, 3 ] },
				expect: [
					[ 'foo', '0' ], // index
					[ 'foo', '1' ] // index
				]
			}
		];

		cases.forEach( function ( testCase ) {
			expect( recursiveDiffer( testCase.state, testCase.newState ) )
				.toEqual( testCase.expect );
		} );
	} );
} );

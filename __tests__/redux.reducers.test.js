import * as reducers from '../src/redux/reducers'
import * as actionTypes from '../src/redux/constants.actions';
import * as actions from '../src/redux/actions';
import { VisibilityFilters } from '../src/redux/constants.visibilityFilters';
const { SHOW_ALL, SHOW_ONGOING } = VisibilityFilters;

describe( 'app reducer', () => {
	it( 'Returns initial state when none are given', () => {
		expect( reducers.todoApp( undefined, {} ) )
			.toEqual( {
				visibilityFilter: SHOW_ALL,
				visibleItems: [],
				items: {},
				starred: []
			} );
	} );
} );

describe( 'visibilityFilter reducer', () => {
	it( 'Returns initial state when none are given', () => {
		expect( reducers.visibilityReducer( undefined, {} ) )
			.toEqual( SHOW_ALL );
	} );

	it( 'Changes state if one is given', () => {
		expect( reducers.visibilityReducer( SHOW_ALL, {
			type: actionTypes.SET_VISIBILITY_FILTER,
			filter: SHOW_ONGOING
		} ) )
			.toEqual( SHOW_ONGOING );
	} );
} );

describe( 'items reducer', () => {
	it( 'Returns initial state when none are given', () => {
		expect( reducers.itemsReducer( undefined, {} ) )
			.toEqual( {} );
	} );

	it( 'Adds a TODO item', () => {
		expect( reducers.itemsReducer( {}, {
			type: actionTypes.ADD_TODO,
			id: '123',
			created: '654321',
			title: 'Foo',
			content: 'Bar'
		} ) )
		.toEqual( {
			123: {
				id: '123',
				completed: false,
				created: '654321',
				title: 'Foo',
				content: 'Bar'
			}
		} );
	} );

	it( 'Removes a TODO item', () => {
		expect( reducers.itemsReducer(
			{
				'123': {
					completed: false,
					created: '98765345',
					title: 'test title',
					content: ''
				},
				'234': {
					completed: true,
					created: '98745766',
					title: 'test title 2',
					content: 'some content'
				}
			},
			{
				type: actionTypes.REMOVE_TODO,
				id: '123'
			}
		) )
		.toEqual( {
			'234': {
				completed: true,
				created: '98745766',
				title: 'test title 2',
				content: 'some content'
			}
		} );
	} );
} );

describe( 'visibleItems reducer', () => {
	const mockState = {
		visibilityFilter: 'SHOW_ALL',
		visibleItems: [ '1', '2', '3', '4' ],
		items: {
			'1': {
				completed: false,
				created: 123123,
				title: 'testItem',
				content: 'test item 1'
			},
			'2': {
				completed: true,
				created: 123124,
				title: 'testItem',
				content: 'test item 2'
			},
			'3': {
				completed: false,
				created: 123125,
				title: 'testItem',
				content: 'test item 3'
			},
			'4': {
				completed: true,
				created: 123126,
				title: 'testItem',
				content: 'test item 4'
			}
		},
		starred: []
	};

	it( 'Returns initial state when none are given', () => {
		expect( reducers.visibleItemsReducer( undefined, {} ) )
			.toEqual( [] );
	} );

	it( 'When visibility filter changes to SHOW_ONGOING, returns an array of ongoing items', () => {
		expect(
			reducers.visibleItemsReducer( mockState, actions.setVisibilityFilter( 'SHOW_ONGOING' ) )
		)
			.toEqual( [ '1', '3' ] );
	} );

	it( 'When visibility filter changes to SHOW_COMPLETED, returns an array of completed items', () => {
		expect(
			reducers.visibleItemsReducer( mockState, actions.setVisibilityFilter( 'SHOW_COMPLETED' ) )
		)
			.toEqual( [ '2', '4' ] );
	} );

	it( 'When visibility filter changes to SHOW_ALL, returns an array of all items', () => {
		expect(
			reducers.visibleItemsReducer( mockState, actions.setVisibilityFilter( 'SHOW_ALL' ) )
		)
			.toEqual( [ '1', '2', '3', '4' ] );
	} );

	it( 'When an item is toggled, it is reflected in the visible items list', () => {
		const allState = reducers.todoApp( mockState, actions.setVisibilityFilter( 'SHOW_ALL' ) ),
			ongoingState = reducers.todoApp( mockState, actions.setVisibilityFilter( 'SHOW_ONGOING' ) ),
			completedState = reducers.todoApp( mockState, actions.setVisibilityFilter( 'SHOW_COMPLETED' ) );

		// NOTE: We are sorting the arrays because the order doesn't matter, we want to check
		// the actual contents

		expect( reducers.visibleItemsReducer( Object.assign( {}, allState ), actions.toggleTodo( '1' ) ).sort() )
			.toEqual( [ '1', '2', '3', '4' ].sort() ); // No change; show all

		expect( reducers.visibleItemsReducer( Object.assign( {}, ongoingState ), actions.toggleTodo( '2' ) ).sort() )
			.toEqual( [ '1', '2', '3' ].sort() ); // Started with  [ '1', '3' ]
		expect( reducers.visibleItemsReducer( Object.assign( {}, ongoingState ), actions.toggleTodo( '1' ) ).sort() )
			.toEqual( [ '3' ].sort() ); // Started with  [ '1', '3' ]

		expect( reducers.visibleItemsReducer( Object.assign( {}, completedState ), actions.toggleTodo( '3' ) ).sort() )
			.toEqual( [ '2', '3', '4' ].sort() ); // Started with  [ '2', '4' ]
		expect( reducers.visibleItemsReducer( Object.assign( {}, completedState ), actions.toggleTodo( '4' ) ).sort() )
			.toEqual( [ '2' ].sort() ); // Started with  [ '2', '4' ]

	} );

	it( 'When an item is added, it is reflected in the visible items list', () => {
		const allState = reducers.todoApp( mockState, actions.setVisibilityFilter( 'SHOW_ALL' ) ),
			ongoingState = reducers.todoApp( mockState, actions.setVisibilityFilter( 'SHOW_ONGOING' ) ),
			completedState = reducers.todoApp( mockState, actions.setVisibilityFilter( 'SHOW_COMPLETED' ) );

		expect( reducers.visibleItemsReducer( Object.assign( {}, allState ), actions.addTodo( 'Todo5', 'Content5', '13123', '5' ) ).sort() )
			.toEqual( [ '1', '2', '3', '4', '5' ].sort() ); // Always add when showing all
		expect( reducers.visibleItemsReducer( Object.assign( {}, ongoingState ), actions.addTodo( 'Todo5', 'Content5', '13123', '5' ) ).sort() )
			.toEqual( [ '1', '3', '5' ].sort() ); // Started with [ '1', '3' ] - Always add when showing ongoing
		expect( reducers.visibleItemsReducer( Object.assign( {}, completedState ), actions.addTodo( 'Todo5', 'Content5', '13123', '5' ) ).sort() )
			.toEqual( [ '2', '4' ].sort() ); // Started with [ '2', '4' ] - Never add when showing completed

	} );

	it( 'When an item is deleted, it is reflected in the visible items list', () => {
		const allState = reducers.todoApp( mockState, actions.setVisibilityFilter( 'SHOW_ALL' ) ),
			ongoingState = reducers.todoApp( mockState, actions.setVisibilityFilter( 'SHOW_ONGOING' ) ),
			completedState = reducers.todoApp( mockState, actions.setVisibilityFilter( 'SHOW_COMPLETED' ) );

		expect( reducers.visibleItemsReducer( Object.assign( {}, allState ), actions.removeTodo( '1' ) ).sort() )
			.toEqual( [ '2', '3', '4' ].sort() );
		expect( reducers.visibleItemsReducer( Object.assign( {}, ongoingState ), actions.removeTodo( '1' ) ).sort() )
			.toEqual( [ '3' ].sort() ); // Started with [ '1', '3' ]
		expect( reducers.visibleItemsReducer( Object.assign( {}, completedState ), actions.removeTodo( '4' ) ).sort() )
			.toEqual( [ '2' ].sort() ); // Started with [ '2', '4' ]

	} );
} );

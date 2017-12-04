import * as reducers from '../src/redux/reducers'
import * as actionTypes from '../src/redux/constants.actions';
import { VisibilityFilters } from '../src/redux/constants.visibilityFilters';
const { SHOW_ALL, SHOW_ONGOING } = VisibilityFilters;

describe( 'app reducer', () => {
	it( 'Returns initial state when none are given', () => {
		expect( reducers.todoApp( undefined, {} ) )
			.toEqual( {
				visibilityFilter: SHOW_ALL,
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
} );

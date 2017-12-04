import * as actions from '../src/redux/actions'
import * as types from '../src/redux/constants.actions'

describe( 'Creating ADD_TODO actions', () => {
	const cases = [
		{
			title: 'testing title',
			content: 'testing content',
			timestamp: Date.now() - 10000,
			msg: 'Create action with full details given.'
		},
		{
			title: 'Title only',
			msg: 'Create action with only title given'
		},
		{
			content: 'Content only',
			msg: 'Create action with only content given'
		},
		{
			msg: 'Create action with no details at all'
		}
	];

	cases.forEach( function ( testCase ) {
		const expectedResult = {
			type: types.ADD_TODO,
			created: testCase.timestamp,
			title: testCase.title,
			content: testCase.content
		};

		it( testCase.msg, () => {
			expect(
				actions.addTodo( testCase.title, testCase.content, testCase.timestamp )
			).toEqual( expectedResult );
		} );

	} );
} );

describe( 'Creating TOGGLE_TODO actions', () => {
	it( 'Create toggle action', () => {
		expect(
			actions.toggleTodo( 1 )
		).toEqual( {
			type: types.TOGGLE_TODO,
			id: 1
		} );
	} );
} );

describe( 'Creating TOGGLE_STAR_TODO actions', () => {
	it( 'Create toggle star todo action', () => {
		expect(
			actions.toggleStarTodo( 2 )
		).toEqual( {
			type: types.TOGGLE_STAR_TODO,
			id: 2
		} );
	} );
} );

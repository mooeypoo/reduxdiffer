import { VisibilityFilters } from './constants.visibilityFilters';
import * as actionTypes from './constants.actions';
const { SHOW_ALL } = VisibilityFilters;

const initialState = {
		visibilityFilter: VisibilityFilters.SHOW_ALL,
		visibleItems: [],
		items: {},
		starred: []
	},
	initialItemState = initialState.items;


/**
 * Combined reducer for the todo app
 *
 * @param  {Object} state Current state
 * @param  {Object} action Action definition
 * @return {Object} New state
 */
export function todoApp( state = initialState, action ) {
	return {
		visibilityFilter: visibilityReducer( state.visibilityFilter, action ),
		visibleItems: visibleItemsReducer( state, action ),
		items: itemsReducer( state.items, action ),
		starred: starredReducer( state.starred, action )
	};
}

/**
 * Visibility property reducer
 *
 * @param  {string} [state] Current state
 * @param  {Object} action Action definition
 * @return {string} New state
 */
export function visibilityReducer( visibilityState = SHOW_ALL, action ) {
	switch ( action.type ) {
		case actionTypes.SET_VISIBILITY_FILTER:
			return action.filter;
		default:
			return visibilityState;
	}
}

export function visibleItemsReducer( state = initialState, action ) {
	let visibleItems, itemData;

	switch ( action.type ) {
		case actionTypes.SET_VISIBILITY_FILTER:
			return Object.keys( state.items ).filter( function ( itemID ) {
				if ( action.filter === 'SHOW_ALL' ) {
					return true;
				}

				if ( action.filter === 'SHOW_ONGOING' ) {
					return !state.items[ itemID ].completed;
				} else if ( action.filter === 'SHOW_COMPLETED' ) {
					return state.items[ itemID ].completed;
				}
				// The return statement below doesn't work (??)
				// return action.filter === 'SHOW_ALL' ||
				// (
				// 	action.filter === 'SHOW_ONGOING' &&
				// 	!state.items[ itemID ].completed
				// ) ||
				// (
				// 	action.filter === 'SHOW_ONGOING' &&
				// 	state.items[ itemID ].completed
				// );
			} );
		case actionTypes.TOGGLE_TODO:
			visibleItems = [ ...state.visibleItems ];
			// Find the item in the state
			itemData = state.items[ action.id ];
			// TODO: Simplify this if statement from hell
			if (
				state.visibilityFilter === 'SHOW_ALL' &&
				visibleItems.indexOf( action.id ) === -1
			) {
				return visibleItems.concat( action.id );
			} else if ( state.visibilityFilter === 'SHOW_ONGOING' ) {
				if ( itemData.completed && visibleItems.indexOf( action.id ) === -1 ) {
					// Item will be marked ongoing
					return visibleItems.concat( action.id );
				} else if ( !itemData.completed && visibleItems.indexOf( action.id ) !== -1 ) {
					// Item will be marked completed
					return visibleItems.filter( function ( id ) { return id !== action.id } );
				}
			} else if ( state.visibilityFilter === 'SHOW_COMPLETED' ) {
				if ( itemData.completed && visibleItems.indexOf( action.id ) !== -1 ) {
					// Item will be marked ongoing
					return visibleItems.filter( function ( id ) { return id !== action.id } );
				} else if ( !itemData.completed && visibleItems.indexOf( action.id ) === -1 ) {
					// Item will be marked completed
					return visibleItems.concat( action.id );
				}
			}
		case actionTypes.ADD_TODO:
			visibleItems = [ ...state.visibleItems ];
			// We are assuming all new items are not completed
			if (
				state.visibilityFilter === 'SHOW_COMPLETED' ||
				visibleItems.indexOf( action.id ) !== -1
			) {
				return visibleItems;
			}
			return visibleItems.concat( action.id );
		case actionTypes.REMOVE_TODO:
			// Always remove that item from the visible list
			return state.visibleItems.filter( function ( id ) {
				return id !== action.id
			} );
		default:
			return state.visibleItems;
	}
};

/**
 * Items reducer
 *
 * @param  {Object} state Current state
 * @param  {Object} action Action definition
 * @return {Object} New state
 */
export function itemsReducer( itemsState = initialItemState, action ) {
	let id, currItem, newItemData, state,
		newItem = {};

	switch ( action.type ) {
		case actionTypes.ADD_TODO:
			id = action.id || Date.now() + Math.random();
			newItem[ id ] = {
				id,
				completed: false,
				created: action.created,
				title: action.title || '',
				content: action.content || ''
			}

			return Object.assign( {}, itemsState, newItem );
		case actionTypes.REMOVE_TODO:
			state = Object.assign( {}, itemsState );
			delete state[ action.id ];
			return state;
		case actionTypes.TOGGLE_TODO:
			currItem = itemsState[ action.id ];
			newItemData = Object.assign(
				{},
				currItem,
				{ completed: !currItem.completed }
			);
			newItem[ action.id ] = newItemData;

			return Object.assign(
				{},
				itemsState,
				newItem
			);
		default:
			return itemsState;
	}
}

/**
 * Starred reducer
 * @param  {string[]}  [starredState=[]] [description]
 * @param  {Object} action Action definition
 * @return {string[]} New state
 */
export function starredReducer( starredState = [], action ) {
	switch ( action.type ) {
		case actionTypes.REMOVE_TODO:
		case actionTypes.TOGGLE_STAR_TODO:
			if ( starredState.indexOf( action.id ) > -1 ) {
				// Exists in the list, remove it
				return [ ...starredState ].filter( function ( id ) {
					return id !== action.id
				} )
			}
			return [
				...starredState,
				action.id
			]
		default:
			return starredState
	}
}

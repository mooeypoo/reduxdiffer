import { VisibilityFilters } from './constants.visibilityFilters';
import * as actionTypes from './constants.actions';
const { SHOW_ALL } = VisibilityFilters;

const initialState = {
		visibilityFilter: VisibilityFilters.SHOW_ALL,
		visibleItems: [],
		order: [],
		items: {},
		renderedItems: [],
		starred: []
	},
	initialItemState = initialState.items,
	initialOrderState = initialState.order;


/**
 * Combined reducer for the todo app
 *
 * @param	{Object} state Current state
 * @param	{Object} action Action definition
 * @return {Object} New state
 */
export function todoApp( state = initialState, action ) {
	const newState = {
		visibilityFilter: visibilityReducer( state.visibilityFilter, action ),
		visibleItems: visibleItemsReducer( state, action ),
		order: orderReducer( state.order, action ),
		items: itemsReducer( state.items, action ),
		renderedItems: [],
		starred: starredReducer( state.starred, action )
	};

	return Object.assign( {}, newState, { renderedItems: renderedItemsReducer( newState, action ) } );
}

export function renderedItemsReducer( state = initialState, action ) {
	let items = [];

	state.visibleItems.forEach( function ( id ) {
		items[ state.order.indexOf( id ) ] = state.items[ id ];
	} );

	return items.filter( function ( data ) { return data !== null } );
};

/**
 * Visibility property reducer
 *
 * @param	{string} [state] Current state
 * @param	{Object} action Action definition
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

export function orderReducer( orderState = initialOrderState, action ) {
	let currPosition, newPosition, order, newOrder;

	switch ( action.type ) {
		case actionTypes.REORDER_TODO:
			// Get current position in the array
			currPosition = orderState.indexOf( action.id );
			// Normalize new position
			newPosition = action.position;
			if ( action.position < 0 ) {
				newPosition = 0;
			} else if ( action.position > orderState.length - 1 ) {
				newPosition = orderState.length - 1;
			}

			order = [ ...orderState ];
			order
				.splice(
					newPosition, // New position
					0,
					order.splice(
						currPosition, // Old position
						1
					)[ 0 ]
				);
			return order;
		case actionTypes.ADD_TODO:
			// Add to end
			if ( orderState.indexOf( action.id ) === -1 ) {
				return [ ...orderState ].concat( action.id );
			}
			return orderState;
		case actionTypes.REMOVE_TODO:
			// Remove
			return [ ...orderState ].filter( function ( id ) {
				return id !== action.id;
			} );
		default:
			return orderState;
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
 * @param	{Object} state Current state
 * @param	{Object} action Action definition
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
 * @param	{string[]}	[starredState=[]] [description]
 * @param	{Object} action Action definition
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

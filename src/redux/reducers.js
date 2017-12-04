import { VisibilityFilters } from './constants.visibilityFilters';
import * as actionTypes from './constants.actions';
const { SHOW_ALL } = VisibilityFilters;

const initialState = {
	visibilityFilter: VisibilityFilters.SHOW_ALL,
	items: {},
	starred: []
}
const initialItemState = initialState.items;


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
		items: itemsReducer( state.items, action ),
		starred: []
		// starred: starredReducer( state.starred, action )
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

/**
 * Items reducer
 *
 * @param  {Object} state Current state
 * @param  {Object} action Action definition
 * @return {Object} New state
 */
export function itemsReducer( itemsState = initialItemState, action ) {
	let id, currItem, newItemData,
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
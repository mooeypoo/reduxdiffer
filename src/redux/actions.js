import * as types from './constants.actions';

export function addTodo( title, content, created, id ) {
	return {
		type: types.ADD_TODO,
		title,
		content,
		created,
		id
	};
}

export function removeTodo( id ) {
	return {
		type: types.REMOVE_TODO,
		id
	}
}

export function toggleTodo( id ) {
	return {
		type: types.TOGGLE_TODO,
		id
	};
}

export function reorderTodo( id, position ) {
	return {
		type: types.REORDER_TODO,
		id,
		position
	};
}

export function toggleStarTodo( id ) {
	return {
		type: types.TOGGLE_STAR_TODO,
		id
	};
}

export function setVisibilityFilter( filter ) {
	return {
		type: types.SET_VISIBILITY_FILTER,
		filter
	};
}

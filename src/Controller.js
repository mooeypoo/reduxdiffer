import { createStore } from 'redux'
import * as reducers from './redux/reducers'
import * as actions from './redux/actions';
import { VisibilityFilters } from './redux/constants.visibilityFilters';
import { ReduxStoreDiffer } from './ReduxStoreDiffer'

/**
 * An abstraction layer for widgets to use without referring to
 * the underlying structure for reference.
 *
 * @class
 */
export class Controller {
	constructor() {
		this.store = createStore( reducers.todoApp );
		this.differ = new ReduxStoreDiffer( this.store );
	}

	/* Registration for events */

	/**
	 * Subscribe a widget to the differ change when
	 * a specific state path changed
	 *
	 * @param  {Object} widget Subscribed widget
	 * @param  {string[]} path Path to subscribe to
	 * @param  {Mixed[]}  [params=[]] Optional method parameters
	 */
	subscribe( widget, path, method, params = [] ) {
		this.differ.subscribe( widget, path, method, params = [] );
	}

	/**
	 * Unsubscribe a widget from a differ change on a given
	 * path
	 *
	 * @param  {Object} widget Subscribed widget
	 * @param  {string[]} path Path to subscribe to
	 */
	unsubscribe( widget, path ) {
		this.differ.unsubscribe( widget, path );
	}

	/* Actual actions for the UI */

	/**
	 * Add a todo item
	 *
	 * @param {String} [id='']      [description]
	 * @param {String} [title='']   [description]
	 * @param {String} [content=''] [description]
	 */
	addTodo( id = '', title = '', content = '' ) {
		const created = Date.now(),
			state = this.store.getState();
		id = id || created + Math.random();

		// Do not add duplicate ID
		if ( state.items[ id ] ) {
			return;
		}

		title = title || 'item ' + id;

		this.store.dispatch(
			actions.addTodo(
				title,
				content,
				created,
				id
			)
		);
	}

	/**
	 * Remove an item
	 * @param {string} id Item ID
	 */
	removeTodo( id ) {
		this.store.dispatch(
			actions.removeTodo( id )
		);
	}

	/**
	 * Toggle the complete status of an item
	 *
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	toggleTodo( id ) {
		this.store.dispatch(
			actions.toggleTodo( id )
		);
	}

	/**
	 * Toggle the starred state of an item
	 *
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	toggleStarTodo( id ) {
		// Validate ID
		const state = this.store.getState();

		if ( Object.keys( state.items ).indexOf( id ) === -1 ) {
			// Item doesn't exist
			return;
		}

		this.store.dispatch(
			actions.toggleStarTodo( id )
		);
	}

	/**
	 * Change visibility filter
	 *
	 * @param {String} [filter='all'] Visibility filter
	 *  representation: 'all', 'completed', 'ongoing'
	 */
	setVisibilityFilter( filter = 'all' ) {
		const map = {
			'all': VisibilityFilters.SHOW_ALL,
			'completed': VisibilityFilters.SHOW_COMPLETED,
			'ongoing': VisibilityFilters.SHOW_ONGOING
		};

		if ( Object.keys( map).indexOf( filter ) === -1 ) {
			// If filter isn't recognized, normalize to default
			filter = 'all';
		}

		this.store.dispatch(
			actions.setVisibilityFilter( map[ filter ] )
		);
	}

	/**
	 * For tests, return the store
	 *
	 * @return {Redux.store} Store
	 */
	getStore() {
		return this.store
	}

	/**
	 * Return the current state, or a portion of it
	 *
	 * @param {string[]} Specified path to get the state of
	 * @return {Object} Current state
	 */
	getState( path = [] ) {
		const state = this.store.getState()
		let result = state;

		path.forEach( function ( piece ) {
			result = result[ piece ]
		} );
		return result;
	}
}

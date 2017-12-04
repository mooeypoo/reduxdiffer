import { createStore } from 'redux'
import * as reducers from './redux/reducers'
import * as actions from './redux/actions';
import { VisibilityFilters } from './redux/constants.visibilityFilters';
import ReduxStoreDiffer from './ReduxStoreDiffer'

export default class Controller {
	constructor() {
		this.store = createStore( reducers.todoApp );
		this.differ = new ReduxStoreDiffer( this.store );
	}

	/* Registration for events */

	subscribe( widget, path ) {
		this.differ.subscribe( widget, path );
	}

	unsubscribe( widget, path ) {
		this.differ.unsubscribe( widget, path );
	}

	/* Actual actions for the UI */
	addTodo( title = '', content = '' ) {
		const created = Date.now(),
			id = created + Math.random();

		this.store.dispatch(
			actions.addTodo(
				title,
				content,
				Date.now(),
				id
			)
		);
	}

	toggleTodo( id ) {
		this.store.dispatch(
			actions.toggleTodo( id )
		);
	}

	toggleStarTodo( id ) {
		this.store.dispatch(
			actions.toggleStarTodo( id )
		);
	}

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

}
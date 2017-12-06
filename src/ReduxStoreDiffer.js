import { recursiveDiffer } from './recursiveDiffer'

/**
 * Registers widgets and notifies them when there are changes
 * to the specific parts of the store that they listen to.
 *
 * @class
 */
export class ReduxStoreDiffer {
	constructor( store ) {
		this.store = store;
		this.currentState = this.store.getState();
		this.subscriptions = {};
		this.subscribeCallback = this.store.subscribe(() => { this.respondToChange() } )
console.log( 'ReduxStoreDiffer initialized' );
	}

	/**
	 * Respond to state change and invoke the methods in the widgets that
	 * registered to the paths changed
	 */
	respondToChange() {
			// Check diff between old and new
			let runCounter = 0;
			const paths = recursiveDiffer(
					this.currentState,
					this.store.getState()
			)
console.log( 'respondToChange', this.currentState, this.store.getState(), paths );
			paths.forEach( ( path ) => {
				let workingPath = path.slice( 0 );

				while ( workingPath.length ) {

					// Trigger method
					this.getSubscriptionsForPath( workingPath ).forEach( ( definition ) => {
						if ( typeof definition.widget[ definition.method ] === 'function' ) {
							definition.widget[ definition.method ].apply( definition.widget, definition.params );
							console.log(
								'> ReduxStoreDiffer: Ran',
								definition.method,
								'in widget',
								definition.widget,
								'with params',
								definition.params
							);
							runCounter++
						}
					} );

					// Go up in the path
					workingPath.pop();
				}
			} );

			// Update current state
			this.currentState = this.store.getState();
	}

	/**
	 * Subscribe a widget to a state path
	 *
	 * @param  {Object} widget Subscribed widget
	 * @param  {Array} path Subscribed store path to listen to
	 * @param  {string} [method='onChange'] Method to invoke in the widget
	 * @param  {Array}  [params=[]] Optional parameters to send to the widget method
	 */
	subscribe( widget, path, method = 'onChange', params = [] ) {
		const pathString = this.stringifyPath( path );

		this.subscriptions[ pathString ] = this.subscriptions[ pathString ] || [];
		this.subscriptions[ pathString ].push( {
			widget,
			method,
			params
		} );
	}

	/**
	 * Unsubscribe a widget from a state path
	 *
	 * @param  {Object} widget Subscribed widget
	 * @param  {string[]} path Store path to unsubscribe from
	 */
	unsubscribe( widget, path ) {
		const registeredWidgets = this.getSubscriptionsForPath( path );

		registeredWidgets.filter( function ( definition ) {
			return ( definition.widget !== widget );
		} );

		if ( !registeredWidgets.length ) {
			// Delete the whole path registration
			delete this.subscriptions[ pathString ];
		}
	}

	/**
	 * Get a string representation of the given path array
	 *
	 * @param  {string[]}  [path=[]] Path array
	 * @return {string} Stringified path
	 */
	stringifyPath( path = [] ) {
		return Array.isArray( path ) ? path.join( '.' ) : path;
	}

	/**
	 * Get an array of all widget and their datas that have subscribed to
	 * a specific path
	 *
	 * @param  {string[]}  [path=[]] Path array
	 * @return {Object[]} An array of widgets and data
	 */
	getSubscriptionsForPath( path = [] ) {
		return this.subscriptions[ this.stringifyPath( path ) ] || [];
	}
}

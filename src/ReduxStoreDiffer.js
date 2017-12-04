import recursiveDiffer from './recursiveDiffer'

export default class ReduxStoreDiffer {
	constructor( store ) {
		const subscribeCallback;

		this.store = store;
		this.currentState = this.store.getState();
		this.subscriptions = {};
		unsubscribe = differStore.subscribe(() =>
			console.log(differStore.getState())
			respondToChange()
		)
	}

	respondToChange() {
			// Check diff between old and new
			let runCounter = 0;
			const paths = recursiveDiffer(
					this.currentState,
					this.store.getState()
			)

			paths.forEach( function ( path ) {
				let registeredWidgets,
					workingPath = path.slice( 0 );

				while ( workingPath.length ) {
					registeredWidgets = this.getSubscriptionsForPath( workingPath );

					// Trigger method
					this.getSubscriptionsForPath( workingPath ).forEach( function ( definition ) {
						definition.widget[ definition.method ]();
						runCounter++
					} );

					// Go up in the path
					workingPath.pop();
				}
			} );

			console.log( 'Ran ' + runCounter + ' methods for widgets' );
	}

	subscribe( widget, path, method = 'onChange' ) {
		const pathString = Array.isArray( path ) ? path.join( '.' ) : path;

		this.subscriptions[ pathString ] = this.subscriptions[ pathString ] || [];
		this.subscriptions[ pathString ].push( {
			widget,
			method
		} );
	}

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

	getSubscriptionsForPath( path = [] ) {
		const pathString = Array.isArray( path ) ? path.join( '.' ) : path,
			return this.subscriptions[ pathString ] || [];
	}
}

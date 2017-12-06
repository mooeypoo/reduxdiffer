import { ReduxStoreDiffer } from '../src/ReduxStoreDiffer'
import { Controller } from '../src/Controller'

let log = [];

class TestWidget {
    logEvent( action ) {
        log.push( action );
    }
}

describe( 'ReduxStoreDiffer', () => {
    var widget = new TestWidget(),
        controller = new Controller(),
        storeDiffer = new ReduxStoreDiffer( controller.getStore() );

    storeDiffer.subscribe( widget, [ 'items' ], 'logEvent', [ 'items' ] );
    storeDiffer.subscribe( widget, [ 'visibilityFilter' ], 'logEvent', [ 'visibilityFilter' ] );

    // Fill in the state with items
    controller.addTodo( '123', 'title123', 'content123' ); // log: [ 'items' ]
    controller.addTodo( '456', 'title456', 'content456' ); // log: [ 'items', 'items' ]
    controller.addTodo( '789', 'title789', 'content789' ); // log: [ 'items', 'items', 'items' ]

    // Register to a specific item path
    storeDiffer.subscribe( widget, [ 'items', '123' ], 'logEvent', [ 'items.123' ] );

    // log: [ 'items', 'items', 'items', 'items', 'item 123' ]
    // There's another "items" in there, because the object is notified
    // twice; once for the item, and once for the general items parent path
    controller.toggleTodo( '123' );

    it( 'Registered all events', () => {
		expect( log ).toEqual( [
            'items',
            'items',
            'items',
            'items.123',
            'items', // Also notified 'items' as part of the parent path
        ] );
	} );
} );

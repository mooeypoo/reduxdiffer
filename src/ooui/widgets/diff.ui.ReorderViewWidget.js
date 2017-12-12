diff.ui.ReorderViewWidget = function DiffUiReorderViewWidget( controller, config ) {
	config = config || {};

	// Parent constructor
	diff.ui.ReorderViewWidget.parent.call( this, config );

	this.list = new OO.ui.ButtonGroupWidget( {
		classes: [ 'diff-ui-reorderViewWidget-list' ]
	} );

	this.controller = controller;
	// Suscribe to state change
	this.controller.subscribe(
		this,
		[ 'order' ], // Path
		'update' // Method
	);

	this.$element
		.addClass( 'diff-ui-actionWidget' )
		.append( this.list.$element );

	this.update();
};

OO.inheritClass( diff.ui.ReorderViewWidget, OO.ui.Widget );

diff.ui.ReorderViewWidget.prototype.update = function () {
	var i, item,
		itemsToRemove = [],
		order = this.controller.getState( [ 'order' ] ),
		stateItems = this.controller.getState( [ 'items' ] );

	for ( i = 0; i < order.length; i++ ) {
		item = this.list.getItemFromData( order[ i ] );
		if ( !item ) {
			// Create the item
			item = new OO.ui.ButtonWidget( {
				disabled: true,
				framed: false,
				data: order[ i ],
				label: stateItems[ order[ i ] ].title
			} );
		}
		// Insert in a new position
		this.list.addItems( [ item ], i );

	}

	// Clean up the current items in case an item was removed
	itemsToRemove = this.list.getItems().filter( function ( item ) {
		return order.indexOf( item.getData() ) === -1;
	} );
	this.list.removeItems( itemsToRemove );
};

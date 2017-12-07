diff.ui.TaskGroupWidget = function DiffUiTaskGroupWidet( controller, config ) {
	config = config || {};

	// Parent constructor
	diff.ui.TaskGroupWidget.parent.call( this, config );
	// Mixins
	OO.ui.mixin.GroupWidget.call( this, config );

	this.controller = controller;

	// Suscribe to state change
	this.controller.subscribe(
		this,
		[ 'items' ], // Path
		'update' // Method
	);
	this.controller.subscribe(
		this,
		[ 'visibleItems' ], // Path
		'updateVisibility' // Method
	);

	this.$element
		.addClass( 'diff-ui-taskGroupWidget' )
		.append( this.$group );

	// Update based on initial state
	this.update();
	this.updateVisibility();
};

OO.inheritClass( diff.ui.TaskGroupWidget, OO.ui.Widget );
OO.mixinClass( diff.ui.TaskGroupWidget, OO.ui.mixin.GroupWidget );

diff.ui.TaskGroupWidget.prototype.update = function () {
	var state = this.controller.getState( [ 'items' ] ),
		stateItemIDs = Object.keys( state ),
		itemsToDelete = [],
		itemsToAdd = [],
		widget = this;

	// If the item isn't in the state, delete it
	itemsToDelete = this.getItems().filter( function ( itemWidget ) {
		// Return items that do not appear in the state
		return stateItemIDs.indexOf( itemWidget.getID() ) === -1;
	} );
	this.removeItems( itemsToDelete );

	// Add items from the state if they don't already exist
	$.each( state, function ( itemID ) {
		var item;
		if ( !widget.getItemFromData( itemID ) ) {
			item = new diff.ui.TaskItemWidget(
				itemID,
				widget.controller
			);
			item.toggle(
				widget.controller.getState( [ 'visibilityFilter' ] ) !== 'SHOW_COMPLETED'
			);
			itemsToAdd.push( item );
		}
	} );
	this.addItems( itemsToAdd );
};

diff.ui.TaskGroupWidget.prototype.updateVisibility = function () {
	var visibleItems = this.controller.getState( [ 'visibleItems' ] );

	this.getItems().forEach( function ( itemWidget ) {
		itemWidget.toggle( visibleItems.indexOf( itemWidget.getID() ) !== -1 );
	} );
};

diff.ui.TaskGroupWidget = function DiffUiTaskGroupWidet( controller, config ) {
	config = config || {};

	// Parent constructor
	diff.ui.TaskGroupWidget.parent.call( this, config );
	// Mixins
	OO.ui.mixin.GroupWidget.call( this, config );
	OO.ui.mixin.DraggableGroupElement.call( this, config );

	this.controller = controller;

	// Suscribe to state change
	this.controller.subscribe(
		this,
		[ 'renderedItems' ], // Path
		'update' // Method
	);

	// Events
	this.connect( this, { reorder: 'onReorder' } );

	this.$element
		.addClass( 'diff-ui-taskGroupWidget' )
		.append( this.$group );

	// Update based on initial state
	this.update();
};

OO.inheritClass( diff.ui.TaskGroupWidget, OO.ui.Widget );
OO.mixinClass( diff.ui.TaskGroupWidget, OO.ui.mixin.GroupWidget );
OO.mixinClass( diff.ui.TaskGroupWidget, OO.ui.mixin.DraggableGroupElement );

diff.ui.TaskGroupWidget.prototype.update = function () {
	var renderedItems = this.controller.getState( [ 'renderedItems' ] ),
		items = [],
		widget = this;

	this.clearItems();

	renderedItems.forEach( function ( itemData ) {
		items.push(
			new diff.ui.TaskItemWidget( itemData.id, widget.controller )
		);
	} );

	this.addItems( items );
};

diff.ui.TaskGroupWidget.prototype.onReorder = function ( item, position ) {
	this.controller.reorderTodo( item.getID(), position );
};

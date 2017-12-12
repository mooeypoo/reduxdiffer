diff.ui.TaskItemWidget = function DiffUiTaskItemWidet( id, controller, config ) {
	var $handle = $( '<div>' )
		.addClass( 'diff-ui-taskItemWidget-handle' );
	config = config || {};

	// Parent constructor
	diff.ui.TaskItemWidget.parent.call( this, $.extend( { data: id }, config ) );
	// Mixins
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.DraggableElement.call( this, $.extend( { $handle: $handle }, config ) );

	this.id = id;
	this.controller = controller;

	this.contentLabel = new OO.ui.LabelWidget( {
		classes: [ 'diff-ui-taskItemWidget-wrap-content' ]
	} );
	this.toggleButton = new OO.ui.ButtonWidget( {
		classes: [ 'diff-ui-taskItemWidget-toggleButton' ]
	} );
	this.starButton = new OO.ui.ButtonWidget( {
		framed: false,
		icon: 'star',
		classes: [ 'diff-ui-taskItemWidget-starButton' ]
	} );
	this.removeButton = new OO.ui.ButtonWidget( {
		framed: false,
		icon: 'close',
		classes: [ 'diff-ui-taskItemWidget-removeButton' ]
	} );
	this.toggleButton.connect( this, { click: 'toggleDone' } );
	this.removeButton.connect( this, { click: 'remove' } );
	this.starButton.connect( this, { click: 'star' } );

	// Suscribe to state change
	this.controller.subscribe(
		this,
		[ 'items', this.id ], // Path
		'update' // Method
	);
	this.controller.subscribe(
		this,
		[ 'starred' ], // Path
		'updateStarred' // Method
	);

	this.$element
		.addClass( 'diff-ui-taskItemWidget' )
		.append(
			this.$handle,
			this.$icon
				.addClass( 'diff-ui-taskItemWidget-icon' ),
			this.removeButton.$element,
			this.starButton.$element,
			this.toggleButton.$element,
			$( '<div>' )
				.addClass( 'diff-ui-taskItemWidget-wrap' )
				.append(
					this.$label
						.addClass( 'diff-ui-taskItemWidget-wrap-title' ),
					this.contentLabel.$element
				)
		);

	// Update based on initial state
	this.update();
	this.updateStarred();
};

/* Initialization */
OO.inheritClass( diff.ui.TaskItemWidget, OO.ui.Widget );
OO.mixinClass( diff.ui.TaskItemWidget, OO.ui.mixin.IconElement );
OO.mixinClass( diff.ui.TaskItemWidget, OO.ui.mixin.LabelElement );
OO.mixinClass( diff.ui.TaskItemWidget, OO.ui.mixin.DraggableElement );

/**
 * Update the widget
 */
diff.ui.TaskItemWidget.prototype.update = function () {
	var state = this.controller.getState( [ 'items', this.id ] );

	if ( !state ) {
		return;
	}

	this.setLabel( state.title );
	this.contentLabel.setLabel( state.content );
	this.setIcon( state.completed ? 'check' : '' );
	this.$element
		.toggleClass( 'diff-ui-taskItemWidget-completed', state.completed );
	this.toggleButton.setLabel(
		state.completed ?
			'Reopen' :
			'Mark as done'
	);
};

diff.ui.TaskItemWidget.prototype.updateStarred = function () {
	var state = this.controller.getState( [ 'starred' ] );
	this.starButton.setIcon(
		state.indexOf( this.id ) !== -1 ? 'unStar' : 'star'
	);
};
/**
 * Toggle the complete status of this item
 */
diff.ui.TaskItemWidget.prototype.toggleDone = function () {
	this.controller.toggleTodo( this.id );
};

diff.ui.TaskItemWidget.prototype.star = function () {
	this.controller.toggleStarTodo( this.id );
};

/**
 * Remove this item
 */
diff.ui.TaskItemWidget.prototype.remove = function () {
	this.controller.removeTodo( this.id );
};

/**
 * Get item ID
 * @return {string} Item ID
 */
diff.ui.TaskItemWidget.prototype.getID = function () {
	return this.id;
};

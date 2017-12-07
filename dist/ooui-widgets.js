window.diff = window.diff || {};
window.diff.ui = window.diff.ui || {};

diff.ui.ActionWidget = function DiffUiActionWidget( controller, config ) {
	config = config || {};

	// Parent constructor
	diff.ui.ActionWidget.parent.call( this, config );

	this.controller = controller;

	this.filterSelectWidget = new OO.ui.ButtonSelectWidget( {
		items: [
			new OO.ui.ButtonOptionWidget( {
				data: 'SHOW_ALL',
				label: 'All'
			} ),
			new OO.ui.ButtonOptionWidget( {
				data: 'SHOW_ONGOING',
				label: 'Ongoing'
			} ),
			new OO.ui.ButtonOptionWidget( {
				data: 'SHOW_COMPLETED',
				label: 'Completed'
			} )
		],
		classes: [ 'diff-ui-actionWidget-filterSelect' ]
	} );

	this.filterSelectWidget.connect( this, { choose: 'onFilterSelectChoose' } );
	this.$element
		.addClass( 'diff-ui-actionWidget' )
		.append( this.filterSelectWidget.$element );

	this.update();
};

OO.inheritClass( diff.ui.ActionWidget, OO.ui.Widget );

diff.ui.ActionWidget.prototype.onFilterSelectChoose = function ( item ) {
	var data = item.getData();

	this.controller.setVisibilityFilter( data );
};

diff.ui.ActionWidget.prototype.update = function () {
	var state = this.controller.getState( [ 'visibilityFilter' ] );

	this.filterSelectWidget.selectItem(
		this.filterSelectWidget.getItemFromData( state )
	);
};

diff.ui.AddTaskWidget = function DiffUiAddTaskWidget( controller, config ) {
	config = config || {};

	// Parent constructor
	diff.ui.AddTaskWidget.parent.call( this, config );

	this.controller = controller;

	this.titleInput = new OO.ui.TextInputWidget( {
		placeholder: 'Title',
		classes: [ 'diff-ui-addTaskWidget-title' ]
	} );

	this.contentInput = new OO.ui.MultilineTextInputWidget( {
		placeholder: 'Content',
		classes: [ 'diff-ui-addTaskWidget-content' ]
	} );

	this.submitButton = new OO.ui.ButtonWidget( {
		label: 'Add task',
		classes: [ 'diff-ui-addTaskWidget-actions-submit' ],
		flags: [ 'constructive', 'primary' ],
		disabled: true
	} );

	this.resetButton = new OO.ui.ButtonWidget( {
		label: 'Add task',
		classes: [ 'diff-ui-addTaskWidget-actions-reset' ],
		flags: [ 'destructive' ]
	} );

	// Events
	this.titleInput.connect( this, { change: 'onTitleInputChange' } );
	this.submitButton.connect( this, { click: 'onSubmitButtonClick' } );
	this.resetButton.connect( this, { click: 'reset' } );

	this.$element
		.addClass( 'diff-ui-addTaskWidget' )
		.append(
			this.titleInput.$element,
			this.contentInput.$element,
			$( '<div>' )
				.addClass( 'diff-ui-addTaskWidget-actions' )
				.append(
					this.resetButton.$element,
					this.submitButton.$element
				)
		)
};

/* Initialization */
OO.inheritClass( diff.ui.AddTaskWidget, OO.ui.Widget );

/**
 * Respond to change event
 * @param  {[type]} text Current value of the input
 * @return {[type]}      [description]
 */
diff.ui.AddTaskWidget.prototype.onTitleInputChange = function ( text ) {
	this.submitButton.setDisabled(
		!this.titleInput.getValue().trim()
	);
};

diff.ui.AddTaskWidget.prototype.onSubmitButtonClick = function () {
	var id = Date.now() + Math.floor( Math.random() * 11 );

	this.controller.addTodo(
		id,
		this.titleInput.getValue(),
		this.contentInput.getValue()
	);

	this.reset();
};

diff.ui.AddTaskWidget.prototype.reset = function () {
	this.titleInput.setValue( '' );
	this.contentInput.setValue( '' );
	this.submitButton.setDisabled( true );
};

diff.ui.StateDisplayWidget = function DiffUiTaskItemWidet( controller, config ) {
	config = config || {};

	// Parent constructor
	diff.ui.StateDisplayWidget.parent.call( this, config );
	OO.ui.mixin.LabelElement.call( this, $.extend( {
		$label: $( '<pre>' )
	}, config ) );

	this.controller = controller;

	// Suscribe to state change
	this.controller.subscribe(
		this,
		[ '*' ], // Path
		'update' // Method
	);

	this.$element
		.addClass( 'diff-ui-stateDisplayWidget' )
		.append( this.$label );
};

/* Initialization */
OO.inheritClass( diff.ui.StateDisplayWidget, OO.ui.Widget );
OO.mixinClass( diff.ui.StateDisplayWidget, OO.ui.mixin.LabelElement );

diff.ui.StateDisplayWidget.prototype.update = function () {
	this.setLabel(
		JSON.stringify( this.controller.getState(), null, '\t' )
	);
};

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

diff.ui.TaskItemWidget = function DiffUiTaskItemWidet( id, controller, config ) {
	config = config || {};

	// Parent constructor
	diff.ui.TaskItemWidget.parent.call( this, $.extend( { data: id }, config ) );
	// Mixins
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.LabelElement.call( this, config );

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
};

/* Initialization */
OO.inheritClass( diff.ui.TaskItemWidget, OO.ui.Widget );
OO.mixinClass( diff.ui.TaskItemWidget, OO.ui.mixin.IconElement );
OO.mixinClass( diff.ui.TaskItemWidget, OO.ui.mixin.LabelElement );

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

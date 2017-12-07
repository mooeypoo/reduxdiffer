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

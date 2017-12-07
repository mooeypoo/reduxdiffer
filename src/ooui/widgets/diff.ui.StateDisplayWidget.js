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

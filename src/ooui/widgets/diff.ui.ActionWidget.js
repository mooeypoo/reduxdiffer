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

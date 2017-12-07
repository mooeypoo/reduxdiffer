import { Controller } from '../src/Controller'
import { VisibilityFilters } from '../src/redux/constants.visibilityFilters';

describe( 'Controller', () => {
    let controller;
    const initialState = {
    	visibilityFilter: VisibilityFilters.SHOW_ALL,
		visibleItems: [],
    	items: {},
    	starred: []
    }

    it( 'State is initialized', () => {
        controller = new Controller();
        expect( controller.getState() ).toEqual( initialState );
    } );


    it( 'Adding item', () => {
        controller = new Controller();

        controller.addTodo( '123', 'title123', 'content123' );
        expect( controller.getState().items ).toHaveProperty( '123.title', 'title123' );

        controller.addTodo( '123', 'title123', 'content123' );
        // Does not add duplicate ID
        expect( Object.keys( controller.getState().items ).length ).toEqual( 1 );
        expect( controller.getState().items ).toHaveProperty( '123.title', 'title123' );
    } );

    it( 'Adding mutiple items', () => {
        controller = new Controller();

        controller.addTodo( '123', 'title123', 'content345' );
        controller.addTodo( '234', 'title234', 'content345' );
        controller.addTodo( '345', 'title345', 'content345' );
        expect( Object.keys( controller.getState().items ).length ).toEqual( 3 );
    } );

    it( 'Adding item without title', () => {
        controller = new Controller();
        controller.addTodo( '234' );
        // Adding item without title
        expect( Object.keys( controller.getState().items ).length ).toEqual( 1 );
        expect( controller.getState().items ).toHaveProperty( '234.title', 'item 234' );
    } );

    it( 'Toggle item', () => {
        controller = new Controller();
        controller.addTodo( '123', 'title123', 'content123' );
        expect( controller.getState().items ).toHaveProperty( '123.completed', false );
        controller.toggleTodo( '123' );
        expect( controller.getState().items ).toHaveProperty( '123.completed', true );
    } );

    it( 'Toggle starred', () => {
        controller = new Controller();

        controller.addTodo( '123', 'title123', 'content345' );
        controller.addTodo( '234', 'title234', 'content345' );
        controller.addTodo( '345', 'title345', 'content345' );

        expect( controller.getState().starred ).toEqual( [] );

        controller.toggleStarTodo( '234' );
        expect( controller.getState().starred ).toEqual( [ '234' ] );

        controller.toggleStarTodo( '345' );
        expect( controller.getState().starred ).toEqual( [ '234', '345' ] );

        controller.toggleStarTodo( '234' );
        expect( controller.getState().starred ).toEqual( [ '345' ] );

        controller.toggleStarTodo( '666' ); // Item doesn't exist
        expect( controller.getState().starred ).toEqual( [ '345' ] );
    } );

    it( 'Set visibility filters', () => {
        controller = new Controller();
        // Initial/default
        expect( controller.getState().visibilityFilter ).toEqual( 'SHOW_ALL' );

        controller.setVisibilityFilter( 'SHOW_COMPLETED' )
        expect( controller.getState().visibilityFilter ).toEqual( 'SHOW_COMPLETED' );

        controller.setVisibilityFilter( 'SHOW_ALL' )
        expect( controller.getState().visibilityFilter ).toEqual( 'SHOW_ALL' );

        controller.setVisibilityFilter( 'SHOW_ONGOING' )
        expect( controller.getState().visibilityFilter ).toEqual( 'SHOW_ONGOING' );

        // Nonexisting value
        controller.setVisibilityFilter( 'foobar' )
        expect( controller.getState().visibilityFilter ).toEqual( 'SHOW_ALL' );
    } );

} );

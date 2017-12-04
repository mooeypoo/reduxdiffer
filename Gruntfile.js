/*!
 * Grunt file
 *
 * @package reduxdiffer
 */

/* eslint-env node: */
module.exports = function ( grunt ) {
	// grunt.loadNpmTasks( 'grunt-eslint' );
	// grunt.loadNpmTasks( 'grunt-jsonlint' );
	// grunt.loadNpmTasks( 'grunt-stylelint' );
	// grunt.loadNpmTasks( 'grunt-contrib-concat' );
	// grunt.loadNpmTasks( 'grunt-babel' );
	grunt.loadNpmTasks( 'grunt-browserify' );

	grunt.initConfig( {
		// eslint: {
		// 	all: [
		// 		'**/*.js',
		// 		'!{node_modules,vendor,lib,docs}/**/*.js'
		// 	]
		// },
		// stylelint: {
		// 	options: {
		// 		syntax: 'less'
		// 	},
		// 	all: [
		// 		'src/styles/**/*.css',
		// 		'src/styles/**/*.less'
		// 	]
		// },
		// jsonlint: {
		// 	all: [
		// 		'**/*.json',
		// 		'!node_modules/**',
		// 		'!vendor/**'
		// 	]
		// },
		// concat: {
		// 	all: {
		// 		src: [ 'src/*.js', 'src/**/*.js' ],
		// 		dest: 'dist/reduxdiffer.js'
		// 	}
		// },
		browserify: {
			redux: {
				src: [
					'./src/exportES6ToGlobals.js'
				],
				dest: './dist/redux.js',
				options: {
					transform: [ [ 'babelify', { presets: "es2015" } ] ],
					browserifyOptions: {
						debug: true
					}
				}
			}
		}
	} );

	grunt.registerTask('default', [
		'browserify:redux'
	]);
	// grunt.registerTask( 'default', [ 'eslint', 'stylelint', 'jsonlint', 'babel' ] );
	// grunt.registerTask( 'default', [ 'build' ] );
	// grunt.registerTask( 'build', [ 'babel' ] );
};

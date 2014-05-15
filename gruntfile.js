module.exports = function( grunt ) {
	grunt.initConfig( {			
		pkg: grunt.file.readJSON( 'package.json' ),

		nodeunit: {
			all: [ 'test/**/*_test.js' ]
		},

		apidoc: {
			myapp: {
				src: "routes/",
				dest: "doc/",
				template: "node_modules/grunt-apidoc/node_modules/apidoc/template_basic"
			}
		},

		jshint: {
			// define the files to lint
			files: [ 'routes/*.js', 'db/*.js' ],
			options: {
				"-W099": true, // disable: Mixed spaces and tabs.
				"-W014": true, // disable: Bag line breaking
			}
		},

		'gh-pages': {
			options: {
				base: 'doc'
			},
			src: [ '**' ]
		},
		
		'gitpush': {
    		'github': {
      			options: {
      				remote:'origin',
      				branch:'master'
      			}
  	   		}  	   		  	   	
  	   	}		
	} );

	grunt.loadNpmTasks( 'grunt-contrib-nodeunit' );
	grunt.loadNpmTasks( 'grunt-apidoc' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );	
	grunt.loadNpmTasks( 'grunt-git' );
	grunt.loadNpmTasks( 'grunt-gh-pages' );

	grunt.registerTask( 'default', [ 'nodeunit', 'jshint']);
	grunt.registerTask( 'test', [ 'nodeunit' ] );
	grunt.registerTask( 'doc', [ 'apidoc', 'gh-pages']);	
	grunt.registerTask( 'git', [ 'gitpush']);
};

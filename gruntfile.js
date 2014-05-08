module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),

		nodeunit : {
			all : ['test/**/*_test.js']
		},

		apidoc : {
			myapp : {
				src : "routes/",
				dest : "doc/",
				template:"node_modules/grunt-apidoc/node_modules/apidoc/template_basic"
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-apidoc');

	grunt.registerTask('default', ['nodeunit', 'apidoc']);
	grunt.registerTask('test', ['nodeunit']);
	grunt.registerTask('doc', ['apidoc']);
};

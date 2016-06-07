module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.config.init({
	  useminPrepare: {
	      html: 'index.html',
	      options: {
	        dest: 'dist'
	      }
	  },
	  usemin:{
	  	html:['dist/index.html']
	  },
	  copy: {
			project: {
				expand: true,
				cwd: '.',
				src: ['**', '!gruntfile.js', '!package.json','!bower_components/**','!uploads/**','!node_modules/**', '!font-awesome/**', '!css/**', '!app/**', '!js/**',
				'!bower.json'],
				dest: 'dist'
			},
			fontsMaterial: {
                    expand: true,
                    cwd: 'bower_components/bootstrap-material-design/fonts',
                    src: ['**'],
                    dest: 'dist/fonts'
            },
            fontsAwesome: {
                    expand: true,
                    cwd: 'assets/font-awesome/fonts',
                    src: ['**'],
                    dest: 'dist/fonts'
            },
            fontsBootstrap: {
                    expand: true,
                    cwd: 'bower_components/bootstrap/fonts',
                    src: ['**'],
                    dest: 'dist/fonts'
            },
            templates: {
                    expand: true,
                    cwd: 'app',
                    src: ['**/*.html'],
                    dest: 'dist/app'
            }
		},
		clean: {
			dist: {
				src: 'dist'
			}
		}

	});

	grunt.registerTask('default',[
		'clean',
		'copy', //copia pasta toda para dist
		'copy:fontsMaterial', //copia as fontes do bootstrap material
		'copy:fontsAwesome', //copia as fontes do fontawesome
		'copy:templates', //copia as fontes do fontawesome
		'useminPrepare', //prepara o html, parsea os arquivos
		'concat', //concatena arquivos parseados
		'uglify', //minifica js
    	'cssmin', //minifica css
		'usemin' //da replace nos html e substitui as ocorrencias
    ]);
}

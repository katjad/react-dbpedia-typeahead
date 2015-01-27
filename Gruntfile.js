module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        react: {
            server: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['**/*.jsx'],
                        dest: 'build',
                        ext: '.js'
                    }
                ]
            }
        },
    
       browserify: {
            app: {
                src: 'build/main.js',
                dest: 'app/app.js'

            }
        } 

    });

    grunt.registerTask('serve', [
        'react:server',
        'browserify'
    ]);
};

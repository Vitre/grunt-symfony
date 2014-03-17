grunt-symfony
=============

Grunt module for Symfony2. 

Features
--------

  * automatic grunt.json import for bundles src

Support
-------

  * sass

Bundle config
-------------

[BUNDLE_SRC]/Resources/config/grunt.json

```
{
    "sass": {
        "dist": {
            "options": {
                "style": "compressed",
                "compass": true
            },
            "files": [
                {
                    "expand": true,
                    "cwd": "src/Visy/Visy/Admin/Bundle/Resources/public/scss",
                    "src": ["*.scss"],
                    "dest": "web/@/css/admin",
                    "ext": ".css"
            }]
        }
    }
}
```

Gruntfile implementation
------------------------

```
/*global module:false*/

var gruntSymfony = require('grunt-symfony');

module.exports = function (grunt) {

    // Base configuration.
    var config = {

        // Metadata
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            js: {
                files: 'src/**/*.js',
                options: {
                    livereload: true
                }
            },
            sass: {
                files: 'src/**/*.scss',
                tasks: 'sass',
                options: {
                    compass: true,
                    livereload: true
                }
            }
        }

    };

    // Symfony config import
    gruntSymfony.importBundlesConfig(config, {
        watch: {
            options: {
                livereload: true
            }
        }
    });

    //---

    grunt.initConfig(config);

    // Plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Tasks
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['sass']);

};

```
grunt-symfony
=============

Grunt module for Symfony2.

Features
--------

  * bundle automatic config import

Install
-------

    $ npm install grunt-symfony

Bundle gruntfile
-------------

[BUNDLE_SRC]/Gruntfile.js

```javascript
module.exports = function (grunt, config, bundle, options) {

    config.sass = config.sass || {};
    config.sass[bundle.name + "_dist"] = {
        "options": {
            "style": "compressed",
            "compass": true
        },
        "files": [
            {
                "expand": true,
                "cwd": bundle.resources + "/public/scss",
                "src": ["*.scss"],
                "dest": options.web + "/admin/@/css",
                "ext": ".css"
            }
        ]
    };

    config.watch = config.watch || {};
    config.watch[bundle.name + "_sass"] = {
        files: bundle.resources + "/public/scss/**/*.scss",
        tasks: ["sass:" + bundle.name + "_dist"]
    };

};
```

Gruntfile implementation
------------------------

```javascript
/*global module:false*/

// grunt-symfony import
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

    // Symfony bundles import
    gruntSymfony.importBundles(grunt, config, {
        web: 'web',
        src: 'src',
        gruntFile: 'Gruntfile.js',
        resources: 'Resources'
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

- - -

API
---

### Importing


var gruntSymfony = require('grunt-symfony');

### Methods

**gruntSymfony.importBundles**(object grunt, object config, object options);
Recursively imports bundle Gruntfile.js

#### Options

##### web
Default: 'web'

Web folder path.

##### src
Default: 'src'

Resources path.

##### gruntFile
Default: 'Gruntfile.js'

Bundle Gruntfile filename.

##### resources
Default: 'Resources'

Bundle resources folder name.

- - -
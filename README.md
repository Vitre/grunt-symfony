grunt-symfony
=============

Grunt module for Symfony2.

Features
--------

  * bundle automatic gruntfile import

Install
-------

    $ npm install grunt-symfony

Bundle gruntfile
-------------

[BUNDLE_SRC_ROOT]/Gruntfile.js

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

        // [...] Your tasks

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

    // Modules
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Tasks
    grunt.registerTask('default', ['build', 'watch']);
    grunt.registerTask('build', ['sass']);

};

```


API
---

### Importing


var gruntSymfony = require('grunt-symfony');

### Methods

**gruntSymfony.importBundles**(grunt, config, [options]);

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

---

### bundle object

#### Properties

##### name
Bundle name.

##### name_camelcase
Bundle name in camelcase.

##### name_web
Bundle web name.

##### path
Bundle path.

##### resources
Bundle resources path.

##### web
Bundle web path.

- - -
grunt-symfony ![Monthly downloads](http://img.shields.io/npm/dm/grunt-symfony.svg)
=============

Grunt module for Symfony2.

[![NPM](https://nodei.co/npm/grunt-symfony.png)](https://nodei.co/npm/grunt-symfony/)

Features
--------

  * gruntfile import for src bundles

Links
-----

**GitHub**: https://github.com/Vitre/grunt-symfony

**NPM**: https://www.npmjs.org/package/grunt-symfony

Install
-------

    $ npm install grunt-symfony

Bundle gruntfile
-------------

[BUNDLE_ROOT]/Gruntfile.js

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

Gruntfile config registry
-------------------------
Task stores some information into global grunt config variable. You can use it for custom task creation.

`config.symfony: { bundles: {}, dist_tasks: [], dev_tasks: [] } `

### Task creation example

#### Bundle gruntfile
```javascript
config.symfony.dev_tasks.push('uglify:' + bundle.name + '_dev');
```

#### Global gruntfile
```javascript
grunt.registerTask('build', [].concat(['sass'], config.symfony.dist_tasks, ['uglify']));
```

API
---

### Importing

```javascript
var gruntSymfony = require('grunt-symfony');
```

### Methods

**gruntSymfony.importBundles**(grunt, config, [options])

Recursively imports bundle Gruntfile.js

#### Options

##### web

Type: `String` Default: 'web'

Web folder path.

##### src

Type: `String` Default: 'src'

Resources path.

##### gruntFile

Type: `String` Default: 'Gruntfile.js'

Bundle Gruntfile filename.

##### resources

Type: `String` Default: 'Resources'

Bundle resources folder name.



### Bundle object

#### Properties

##### name

Type: `String`

Bundle name.

##### name_camelcase

Type: `String`

Bundle name in camelcase.

##### name_web

Type: `String`

Bundle web name.

##### path

Type: `String`

Bundle path.

##### resources

Type: `String`

Bundle resources path.

##### web

Type: `String`

Bundle web path.

Release 1.1.23
-------------
* Bundle object new names (`name_dashed`, `name_underscore`)
* Grunt config `laravel` registry `config.laravel: { packages: {...}, dist_tasks: [...], dev_tasks: [...] } `
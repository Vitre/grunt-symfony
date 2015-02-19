/**
 * grunt-symfony
 * @author vitre
 * @licence MIT
 * @version 1.1.23
 * @url https://www.npmjs.org/package/grunt-symfony
 */

"use strict"

var fs = require('fs'),
    path = require('path'),
    extend = require('node.extend');

//---

var defaults = {
    web: 'web',
    src: 'src',
    gruntFile: 'Gruntfile.js',
    resources: 'Resources'
};

var options;

var bundles;

var grunt;

/**
 * getBundles
 * @param root
 * @param r
 */
var getBundles = function (root, r) {
    if (typeof root === 'undefined') {
        root = options.src;
    }
    if (typeof r === 'undefined') {
        r = [];
    }

    var files = fs.readdirSync(root);
    for (var i in files) {
        var path = root + '/' + files[i];
        if (fs.statSync(path).isDirectory()) {
            if (path.match(/Bundle$/)) {

                var name = path.substr(options.src.length + 1, path.length);
                var name_camelcase = name.replace(/\//g, '');
                var name_dashed = name.replace(/\//g, '-');
                var name_underscore = name.replace(/\//g, '_').replace(/-/g, '_');
                var name_web = name_camelcase.toLowerCase().replace(/bundle$/, '');

                var bundle = {
                    name: name,
                    name_camelcase: name_camelcase,
                    name_dashed: name_dashed,
                    name_underscore: name_underscore,
                    name_web: name_web,
                    path: path,
                    resources: path + '/' + options.resources,
                    web: options.web + '/bundles/' + name_web,
                    web_public: '/bundles/' + name_web,
                    gruntFile: path + '/' + options.gruntFile
                };

                if (fs.existsSync(bundle.gruntFile)) {
                    r.push(bundle);
                }
            }
            getBundles(path, r);
        }
    }
    return r;
};

/**
 * importBundle
 * @param bundle
 * @param config
 */
var importBundle = function (bundle, config) {
    var gruntFile = bundle.path + '/' + options.gruntFile;
    if (fs.existsSync(gruntFile)) {
        var filePath = path.resolve(gruntFile);

        console.log('Importing bundle: ' + bundle.name + ' [' + gruntFile + ']');

        require(filePath)(grunt, config, bundle, options);
    }
};

/**
 * importBundles
 * @param config
 */
var importBundles = function (config) {
    bundles = getBundles();

    for (var i = 0; i < bundles.length; i++) {

        config.symfony.bundles[bundles[i].name_underscore] = bundles[i];

        importBundle(bundles[i], config);

    }
};

/**
 * Export importBundles
 * @param _grunt
 * @param config
 * @param _options
 */
exports.importBundles = function (_grunt, config, _options) {
    grunt = _grunt;
    if (typeof _options === 'undefined') {
        options = defaults;
    } else {
        options = extend(true, {}, defaults, _options);
    }

    config.symfony = extend(config.symfony, {
        bundles: {},
        dist_tasks: [],
        dev_tasks: []
    });

    importBundles(config);
}

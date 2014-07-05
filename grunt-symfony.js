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
 * @returns {*}
 */
var getBundles = function (root, r) {
    if (typeof root === 'undefined') {
        root = defaults.src;
    }
    if (typeof r === 'undefined') {
        r = [];
    }

    var files = fs.readdirSync(root);
    for (var i in files) {
        var path = root + '/' + files[i];
        if (fs.statSync(path).isDirectory()) {
            if (path.match(/Bundle$/)) {

                var name = path.substr(defaults.src.length + 1, path.length);

                var bundle = {
                    name: name,
                    name_camelcase: name.replace(/\//g, ''),
                    path: path,
                    resources: path + '/' + defaults.resources
                };

                //console.log(bundle);

                r.push(bundle);
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
    var gruntFile = bundle.path + '/' + defaults.gruntFile;
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
        importBundle(bundles[i], config);
    }
};

/**
 * Export importBundles
 * @param config
 */
exports.importBundles = function (_grunt, config, _options) {
    grunt = _grunt;
    if (typeof _options === 'undefined') {
        options = defaults;
    } else {
        options = extend(true, {}, defaults, _options);
    }
    importBundles(config);
}
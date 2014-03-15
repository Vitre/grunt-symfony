"use strict"

var fs = require('fs');

//---

var options = {
    src: 'src',
    configFile: '/Resources/config/grunt.json'
};

/**
 * getBundles
 * @param root
 * @param r
 * @returns {*}
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
                r.push({
                    name: path.substr(options.src.length + 1, path.length),
                    path: path
                });
            }
            getBundles(path, r);
        }
    }
    return r;
};

/**
 * setBundleConfig
 * @param bundle
 * @param config
 */
var setBundleConfig = function (bundle, config) {
    var gruntPath = bundle.path + options.configFile;
    if (fs.existsSync(gruntPath)) {
        var bundleConfig = JSON.parse(fs.readFileSync(gruntPath, 'utf8'));
        if (bundleConfig) {
            console.log('Importing bundle "' + bundle.name + '"');
            setBundleSass(bundleConfig, config);
        }
    }
};

/**
 * setBundlesConfig
 * @param bundles
 * @param config
 */
var setBundlesConfig = function (bundles, config) {
    for (var i = 0; i < bundles.length; i++) {
        setBundleConfig(bundles[i], config);
    }
};

/**
 * setBundleSass
 * @param bundle
 * @param config
 */
var setBundleSass = function (bundle, config) {
    if (typeof bundle.sass !== 'undefined') {
        for (var k in bundle.sass) {
            config.sass[bundle.name + '_' + k] = bundle.sass[k];

        }
        console.log('sass:', bundle.sass[k]);
    }
};

/**
 * importBundlesConfig
 * @param config
 */
var importBundlesConfig = function (config) {
    var bundles = getBundles();
    setBundlesConfig(bundles, config);
};

/**
 * Export importBundlesConfig
 * @param config
 */
exports.importBundlesConfig = function (config) {
    importBundlesConfig(config);
}
"use strict"

var fs = require('fs');
var extend = require('node.extend');

//---

var defaults = {
    src: 'src',
    configFile: '/Resources/config/grunt.json',
    watch: {
        options: {
            livereload: false
        }
    }

};

var options;

var bundles;

var sassImports = [];

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
                r.push({
                    name: path.substr(defaults.src.length + 1, path.length),
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
    var gruntPath = bundle.path + defaults.configFile;
    if (fs.existsSync(gruntPath)) {
        var bundleConfig = JSON.parse(fs.readFileSync(gruntPath, 'utf8'));
        if (bundleConfig) {
            bundle.config = bundleConfig;
            console.log('Importing bundle "' + bundle.name + '"');
            setBundleSass(bundle, config);
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
    if (typeof config.sass === 'undefined') {
        config.sass = {};
    }
    if (typeof bundle.config.sass !== 'undefined') {
        for (var k in bundle.config.sass) {
            var name = bundle.name + '_' + k;
            config.sass[name] = bundle.config.sass[k];
            sassImports.push({
                name: name,
                files: bundle.path + '/**/*.scss'
            });
            console.log(' - sass:', name);
        }
    }
};

/**
 * importBundlesConfig
 * @param config
 */
var importBundlesConfig = function (config) {
    bundles = getBundles();
    setBundlesConfig(bundles, config);
};

var importBundlesWatch = function (config) {
    config.watch = config.watch || {};
    for (var k in sassImports) {
        if (sassImports[k].files) {
            var task = 'newer:sass:' + sassImports[k].name;
            config.watch[sassImports[k].name + '_sass'] = {
                files: sassImports[k].files,
                options: options.watch,
                tasks: [task]
            };
            console.log('Setting watch for sass "' + sassImports[k].name + '"', '- files: ' + sassImports[k].files, '- task: ' + task);
        }
    }
}

/**
 * Export importBundlesConfig
 * @param config
 */
exports.importBundlesConfig = function (config, _options) {
    if (typeof _options === 'undefined') {
        options = defaults;
    } else {
        options = extend(true, {}, defaults, _options);
    }
    importBundlesConfig(config);
    if (options.watch) {
        importBundlesWatch(config);
    }
}
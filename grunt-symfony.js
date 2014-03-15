
var gruntSymfony = {

    getBundles: function(root, r) {
        if (typeof root === 'undefined') {
            root = 'src';
        }
        if (typeof r === 'undefined') {
            r = [];
        }

        var files = fs.readdirSync(root);
        for (var i in files) {
            var path = root + '/' + files[i];
            if (fs.statSync(path).isDirectory()) {
                if (path.match(/Bundle$/)) {
                    r.push(path);
                }
                getBundles(path, r);
            }
        }
        return r;
    },

    readBundle: function(bundles) {
    },

    readBundles: function(bundles) {

    },

    readBundlesConfig: function(config) {
        for (var i = 0; i < bundles.length; i++) {
            var bundle = bundles[i];
            for (var k in bundle.config.sass) {
                base.sass[bundle.name + '_' + k] = bundle.config.sass[k];
            }
        }

    }

};
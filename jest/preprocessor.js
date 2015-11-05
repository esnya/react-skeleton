"use strict";

var babel = require("babel-core");

module.exports = {
    process: function(src, filename) {
        if (filename.indexOf('node_modules') === -1) {
            return babel.transform(src, {
                filename: filename,
                presets: ['es2015', 'react'],
            }).code;
        }
        return src;
    }
};

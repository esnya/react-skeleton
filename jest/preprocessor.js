"use strict";

var BabelJest = require("babel-jest");
var ReactTools = require("react-tools");

module.exports = {
    process: function() {
        return ReactTools.transform(BabelJest.process.apply(BabelJest, arguments));
    }
};

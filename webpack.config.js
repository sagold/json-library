"use strict";


var webpack = require("webpack");


var env = {
	PRODUCTION: process.env.NODE_ENV === "production",
	DESTINATION: process.env.NODE_ENV === "production" ? "dist" : "build"
};

console.log("env", env);


var config = {
	devtool: env.PRODUCTION ? false : "#eval",
	entry: {
	    "JsonLibrary": "./lib"
	},
	output: {
	    path: env.DESTINATION,
	    filename: "[name].min.js",
	    pathinfo: !env.PRODUCTION,
	    library: "JsonLibrary"
	},
	plugins: [].concat(env.PRODUCTION ? new webpack.optimize.UglifyJsPlugin({compress: {drop_console: true }}) : [])
};


module.exports = config;
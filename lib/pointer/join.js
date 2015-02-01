"use strict";

var stripPointerPrefix = require("./common").stripPointerPrefix;

function join() {
	var args = Array.prototype.map.call(arguments, function (pointer) {
		return stripPointerPrefix(pointer);
	});
	return "#/" + args.join("/").replace(/\/+/g, "/");
}

module.exports = join;

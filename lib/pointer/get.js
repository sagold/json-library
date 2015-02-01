/**
 * json pointer implementation
 */
"use strict";

var common = require("./common");


function get(data, pointer) {
	if (pointer == null || data == null) {
		return null;
	}

	var path = common.stripPointerPrefix(pointer).split("/");
	return _get(data, path);
}

function _get(data, path) {
	var property = path.shift();
	if (property) {
		if (data[property]) {
			return _get(data[property], path);
		} else {
			return null;
		}
	} else {
		return data;
	}
}

module.exports = get;

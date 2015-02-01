/**
 * json pointer implementation
 */
"use strict";

var common = require("./common");


function set(data, pointer, value) {
	if (pointer == null || data == null) {
		return null;
	}

	var key, current = data || {};
	var properties = common.stripPointerPrefix(pointer).split("/");
	while (properties.length > 1) {
		key = properties.shift();
		current = create(current, key);
	}

	key = properties.pop();
	current[key] = value;
	return data;
}

function create(data, key) {
	if (data[key] == null) {
		data[key] = {};
	}
	return data[key]
}

module.exports = set;

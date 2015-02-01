"use strict";

var stripPointerPrefix = require("../pointer/common").stripPointerPrefix;


/**
 * Json pointer resolution on a json schema. Behaves like json pointer on data (omitting definition declarations in
 * pointer, like properties, items, etc) but returns the corresponding target in a json schema.
 *
 * @return {Mixed} schema definition object of given json pointer target
 */
function get(pointer, schema) {
	if (pointer == null || schema == null) {
		return null;
	}
	var pointers = stripPointerPrefix(pointer).split("/");
	return _get(pointers, schema);
}

function _get(path, schema) {
	var key = path.shift();
	if (key == null) {
		return schema;
	}

	if (schema.properties && schema.properties[key]) {
		return _get(path, schema.properties[key]);
	}
}

module.exports = get;

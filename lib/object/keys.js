"use strict";

/**
 * Returns all keys of the given input data
 *
 * @param  {Mixed} value
 * @return {Array} containing keys of given value
 */
function keys(value) {
	var keys;

	if (Array.isArray(value)) {
		keys = value.map(function (value, index) { return index; });

	} else if (Object.prototype.toString.call(value) === "[object Object]") {
		return Object.keys(value);

	} else {
		keys = [];
	}

	return keys;
}

module.exports = keys;

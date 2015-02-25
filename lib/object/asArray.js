"use strict";

/**
 * Converts an object to an array
 *
 * @param  {Mixed} value to convert to array
 * @return {Array} to array converted input
 */
function asArray(value) {
	if (Array.isArray(value)) {
		return value; // prevent duplication
	} else if (Object.prototype.toString.call(value) === "[object Object]") {
		return Object.keys(value).map(function (key) {
			return value[key];
		});
	} else {
		return [];
	}
}

module.exports = asArray;

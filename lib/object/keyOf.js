"use strict";

var forEach = require("./forEach");


/**
 * Returns the key of the value
 *
 * @param  {Object|Array} data	to scan
 * @param  {Mixed} value 		to search
 * @return {String|Number} key of (last) found result or null
 */
function keyOf(data, value) {
	var resultKey = null;
	forEach(data, function (itemValue, itemKey) {
		if (value === itemValue) {
			resultKey = itemKey;
		}
	});

	return resultKey;
}

module.exports = keyOf;

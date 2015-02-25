"use strict";

/**
 * Iterates over object or array, passing each key, value and parentObject to the callback
 *
 * @param  {Object|Array} value	to iterate
 * @param  {Function} callback	receiving key on given input value
 */
function forEach(object, callback) {
	var keys;
	if (Array.isArray(object)) {
		object.forEach(callback);
	} else if (Object.prototype.toString.call(object) === "[object Object]") {
		Object.keys(object).forEach(function (key) {
			callback(object[key], key, object);
		});
	}
}

module.exports = forEach;

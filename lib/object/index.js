"use strict";

/**
 * Object based helper methods
 */
function asArray(object) {
	if (Array.isArray(object)) {
		return object; // prevent duplication
	}
	return Object.keys(object).map(function (key) {
		return object[key];
	});
}

function forEach(object, callback) {
	var keys = Array.isArray(object) ? object : Object.keys(object);
	keys.forEach(function (key) {
		callback(key, object[key], object);
	});
}

function values(mixedValue) {
	var values;

	if (Array.isArray(mixedValue)) {
		values = mixedValue;

	} else if (Object.prototype.toString.call(mixedValue) === "[object Object]") {
		values = Object.keys(mixedValue).map(function (key) {
			return mixedValue[key];
		});

	} else {
		values = [mixedValue];
	}

	return values;
}

/**
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

function keyOf(object, needle) {
	var resultKey = null;
	forEach(object, function (key) {
		if (needle === object[key]) {
			resultKey = key;
		}
	});

	return resultKey;
}

// exports.values = values;
exports.asArray = asArray;
exports.forEach = forEach;
exports.keyOf = keyOf;
exports.keys = keys;

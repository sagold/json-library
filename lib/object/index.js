"use strict";

/**
 * Converts an object to an array
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

/**
 * Returns all values of the given input data
 * @param  {Mixed} value input data
 * @return {Array} array of input data's values
 */
function values(value) {
	var values;

	if (Array.isArray(value)) {
		// []
		values = value;
	} else if (Object.prototype.toString.call(value) === "[object Object]") {
		// {}
		values = Object.keys(value).map(function (key) {
			return value[key];
		});
	} else if (value != null) {
		// *
		values = [value];
	} else {
		values = [];
	}

	return values;
}

/**
 * Returns all keys of the given input data
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

/**
 * Returns the key of the value
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

/**
 * Iterates over object or array, passing each key, value and parentObject to the callback
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

function copy(data) {
	return JSON.parse(JSON.stringify(data));
}

exports.values = values;
exports.asArray = asArray;
exports.copy = copy;
exports.forEach = forEach;
exports.keyOf = keyOf;
exports.keys = keys;
exports.jsonStringifyCircular = require("./jsonStringifyCircular");
exports.jsonParseCircular = require("./jsonParseCircular");


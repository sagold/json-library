"use strict";

var o = require("../object");

var f = {
		query: function (query) {
			return function (item) {
				return valid(item, query);
			}
		},
		queryKey: function (obj, query) {
			return function (key) {
				return valid(obj[key], query);
			}
		},
		queryRegExp: function (obj, query, regex) {
			return function (key) {
				return regex.test(key) ? valid(obj[key], query) : false;
			}
		}
	},

	MAP = {
		"false": false,
		"true": true,
		"null": null
	};


/**
 * Filter properties by query: select|if:property
 *
 * @param  {Object|Array} obj
 * @param  {String} query key:value pairs separated by &
 * @return {Array} values matching the given query
 */
function filterValues(obj, query) {
	return filterKeys(obj, query).map(function (key) {
		return obj[key];
	});
}

var isRegex = /^\{.*\}$/;

/**
 * Filter properties by query: select|if:property
 *
 * @param  {Object|Array} obj
 * @param  {String} query key:value pairs separated by &
 * @return {Array} object keys matching the given query
 */
function filterKeys(obj, query) {
	if (query) {
		var matches = query.split("?", 2), keys, regex;
		if (matches[0] === "*" || matches[0] === "**") {
			keys = o.keys(obj);
			return keys.filter(f.queryKey(obj, matches[1]));

		} else if (isRegex.test(matches[0])) {
			keys = o.keys(obj);
			regex = new RegExp(matches[0].replace(/^\{|\}$/g, ""));
			return keys.filter(f.queryRegExp(obj, matches[1], regex));

		} else if (obj[matches[0]] && valid(obj[matches[0]], matches[1])) {
			return [matches[0]];
		}
	}
	return [];
}

/**
 * Returns true if the query matches. Query: key:value&key:value
 * @param  {Object|Array} obj
 * @param  {String} query key:value pairs separated by &
 * @return {Boolean} if query matched object
 */
function valid(obj, query) {
	if (!query) {
		return true;
	}

	var key, value, valid = true, truthy, query;
	var tests = query.replace(/(\&\&)/g, "§$1§").replace(/(\|\|)/g, "§$1§").split("§");

	var or = false;
	for (var i = 0, l = tests.length; i < l; i += 2) {
		if (tests[i].indexOf(":!") > -1) {
			truthy = false;
			value = tests[i].split(":!");

		} else {
			truthy = true;
			value = tests[i].split(":");
		}

		key = value[0];
		value = value[1];

		if (value === "undefined") {
			// undefined is unmappable
			value = undefined;

		} else {
			value = MAP[value] === undefined ? value : MAP[value];
		}

		value = (truthy ? (value === obj[key]) : (value !== obj[key]));

		if (or) {
			valid = valid || value;
		} else {
			valid = valid && value;
		}

		or = tests[i + 1] === "||";
	}

	return valid;
}

exports.values = filterValues;
exports.keys = filterKeys;
exports.valid = valid;

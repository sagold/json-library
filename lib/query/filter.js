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

/**
 * Filter properties by query: select|if:property
 *
 * @param  {Object|Array} obj
 * @param  {String} query key:value pairs separated by &
 * @return {Array} object keys matching the given query
 */
function filterKeys(obj, query) {
	if (query) {
		var matches = query.split("?", 2);
		if (matches[0] === "*" || matches[0] === "**") {
			var keys = o.keys(obj);
			return keys.filter(f.queryKey(obj, matches[1]));

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
	var value, valid = true, test, truthy;

	if (query) {
		test = query.replace(/([:&?])/g, "§$1§").split("§");

		for (var i = 0, l = test.length; i < l; i += 4) {

			truthy = test[i+2][0] !== "!";
			if (truthy === false) {
				test[i+2] = test[i+2].substr(1);
			}

			if (test[i+2] === "undefined") {
				// undefined is unmappable
				value = test[i+2] = undefined;

			} else {
				value = test[i+2] = MAP[test[i+2]] === undefined ? test[i+2] : MAP[test[i+2]];
			}

			valid = valid && (truthy ? (value === obj[test[i]]) : (value !== obj[test[i]]));
		}
	}
	return valid;
}

exports.values = filterValues;
exports.keys = filterKeys;
exports.valid = valid;

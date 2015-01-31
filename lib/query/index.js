/**
 *
 * JSONPOINTER|*
 *
 * 	asfe/asd/*		=> ITERATIVELY SELECT 1 property or all
 *
 * body/*|type:VariableDeclarator/declarations/*
 *
 *
 * /*|type:true/	=> for all properties | get values which have property: type == true
 *
 *
 *
 * JSONBUILDER
 *
 * /asdje/12/[]/[asd]	add object, add in object, add array, add in array
 *
 * "parent":		returns value of parent or created object
 * "parent[]":		returns object inserted to array
 * "parent[x]":		returns index x or created object
 * "parent.child":	returns object child in parent
 *
 * "parent/1/child"
 * "parent/[]/[]/json
 */
var o = require("../object"),
	pointerCommon = require("../pointer/common");

var f, MAP, emptyArray = [];

MAP = {
	"false": false,
	"true": true,
	"null": null
};

f = {

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
};

function query(obj, jsonpointer, cb) {
	// get steps into obj
	var steps = pointerCommon.stripPointerPrefix(jsonpointer).split("/");
	// cleanup first and last
	if (steps[0] == "") steps.shift();
	if (steps[steps.length - 1] == "") steps.length -= 1;

	_query(obj, steps, cb);
}

function queryCallback(obj, cb) {
	return function (key) {
		cb(obj[key], obj, key);
	}
}

function _query(obj, steps, cb) {
	var matches, query = steps.shift();

	if (steps.length === 0) {

		// get keys matching the query and call back
		matches = filterKeys(obj, query);
		matches.forEach(queryCallback(obj, cb));

		if (/^\*\*/.test(query)) {
			// match this query again
			steps.unshift(query);
			matches = filter(obj, query);
			matches.forEach(function (value) {
				_query(value, steps.slice(0), cb)
			});
		}


	} else {

		if (/^\*\*/.test(query)) {
			// run next query
			_query(obj, steps.slice(0), cb);
			// and match this query (**) again
			steps.unshift(query);
		}

		matches = filter(obj, query);
		matches.forEach(function (value) {
			_query(value, steps.slice(0), cb)
		});
	}
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

/**
 * Filter properties by query: select|if:property
 *
 * @param  {Object|Array} obj
 * @param  {String} query key:value pairs separated by &
 * @return {Array} values matching the given query
 */
function filter(obj, query) {
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
	return emptyArray;
}

exports.filter = filter;
exports.filterKeys = filterKeys;
exports.valid = valid;
exports.query = query;

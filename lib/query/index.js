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
var o = require("../object");

var MAP = {
	"false": false,
	"true": true
};

var f = {
	query: function (query) {
		return function (item) {
			return valid(item, query);
		}
	},
	queryKey: function (query, obj) {
		return function (key) {
			return valid(obj[key], query);
		}
	}
};

function query(obj, jsonpointer, cb) {
	// get steps into obj
	var steps = jsonpointer.split("/");
	// cleanup first and last
	if (steps[0] == "") steps.shift();
	if (steps[steps.length - 1] == "") steps.length -= 1;

	_query(obj, steps, cb);
}

function queryCallback(cb, obj) {
	return function (key) {
		cb(obj[key], obj, key);
	}
}

function _query(obj, steps, cb) {
	var matches, query = steps.shift();
	if (steps.length === 0) {

		matches = filterKeys(obj, query);
		matches.forEach(queryCallback(cb, obj));

	} else {

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
	var value, valid = true, test;
	if (query) {
		test = query.replace(/([:&|])/g, "§$1§").split("§");
		for (var i = 0, l = test.length; i < l; i += 4) {
			value = test[i+2] = MAP[test[i+2]] == null ? test[i+2] : MAP[test[i+2]];
			valid = valid && (value === obj[test[i]]);
		}
	}
	return valid;
}

/**
 * Filter properties by query: select|if:property
 *
 * @param  {Object|Array} obj
 * @param  {String} query key:value pairs separated by &
 * @return {Array} results
 */
function filter(obj, query) {
	return filterKeys(obj, query).map(function (key) {
		return obj[key];
	});
}

function filterKeys(obj, query) {
	if (query) {
		var matches = query.split("|", 2);
		if (matches[0] === "*") {
			return Object.keys(obj).filter(f.queryKey(matches[1], obj));
		} else if (obj[matches[0]] && valid(obj[matches[0]], matches[1])) {
			return [matches[0]];
		}
	}
	return [];
}

exports.filter = filter;
exports.filterKeys = filterKeys;
exports.valid = valid;
exports.query = query;
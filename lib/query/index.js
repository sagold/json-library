"use strict";


exports.get = require("./get");
exports.run = require("./run");
exports.delete = require("./delete");
exports.filter = require("./filter");


var run = require("./run");
var get = require("./get");
queryGet.ALL = get.ALL;
queryGet.POINTER = get.POINTER;
queryGet.VALUE = get.VALUE;
function queryGet(obj, jsonPointer, type) {
	console.log("deprecated: query.queryGet is now deprecated. Use query.get instead");
	return get(obj, jsonPointer, type || undefined);
};

// @deprecated
exports.queryGet = queryGet;

// @deprecated
exports.query = function query() {
	console.log("deprecated: query.query is now deprecated. Use query.run instead");
	return run.apply(null, arguments);
};


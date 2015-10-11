"use strict";


exports.get = require("./get");
exports.query = require("./query");
exports.delete = require("./delete");
exports.filter = require("./filter");

var get = require("./get");
queryGet.ALL = get.ALL;
queryGet.POINTER = get.POINTER;
queryGet.VALUE = get.VALUE;

function queryGet(obj, jsonPointer, type) {
	console.log("deprecated: query.queryGet is now deprecated. Use query.get instead");
	return get(obj, jsonPointer, type || undefined);
}

// @deprecated
exports.queryGet = queryGet;


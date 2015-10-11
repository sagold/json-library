"use strict";


var pointerDelete = require("../pointer/delete");
var queryGet = require("./get");
var array = require("../array");

var POINTER = 3;
var PARENT = 2;


function queryDelete(obj, jsonPointer) {
    var matches = queryGet(obj, jsonPointer, queryGet.ALL);
    matches.forEach(function (match) {
    	pointerDelete(obj, match[POINTER], true);
    });
    matches.forEach(function (match) {
    	if (Array.isArray(match[PARENT])) {
    		array.removeUndefinedItems(match[PARENT]);
    	}
    });
    return obj;
}

module.exports = queryDelete;

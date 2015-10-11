"use strict";


var common = require("./common");
var get = require("./get");
var array = require("../array");


function pointerDelete(data, pointer, keepArrayIndices) {
	var toParent = common.getParentPointer(pointer);
	var lastProperty = common.getLastProperty(pointer);
	var target = get(data, toParent) || data;
	if (target) {
		delete target[lastProperty];
	}
	if (Array.isArray(target) && keepArrayIndices !== true) {
		array.removeUndefinedItems(target);
	}

	return data;
}


module.exports = pointerDelete;

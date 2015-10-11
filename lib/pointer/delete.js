"use strict";


var common = require("./common");
var get = require("./get");


function pointerDelete(data, pointer) {
	var toParent = common.getParentPointer(pointer);
	var lastProperty = common.getLastProperty(pointer);
	var target = get(data, toParent) || data;
	if (target) {
		delete target[lastProperty];
	}

	return data;
}

module.exports = pointerDelete;
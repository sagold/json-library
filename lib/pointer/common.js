"use strict";


function stripPointerPrefix(pointer) {
	pointer = pointer.toString();
	return pointer.replace(/[#/]*/, "");
}

exports.stripPointerPrefix = stripPointerPrefix;

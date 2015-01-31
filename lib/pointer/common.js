"use strict";


function stripPointerPrefix(pointer) {
	return pointer.replace(/[#/]*/, "");
}

exports.stripPointerPrefix = stripPointerPrefix;

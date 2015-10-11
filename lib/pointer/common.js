"use strict";

/**
 * Removes root prefix of pointer
 *
 * @param  {String} pointer
 * @return {String} simple pointer path
 */
function stripPointerPrefix(pointer) {
	pointer = pointer.toString();
	return pointer.replace(/[#/]*/, "");
}

exports.stripPointerPrefix = stripPointerPrefix;

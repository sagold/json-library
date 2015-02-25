"use strict";

var o = require("../object"),
	constants = require("../object/constants"),
	pointer = require("../pointer");


/**
 * Parses json data, assigning all json pointers in <referenceLocation> by their value:JsonPointer.
 * If previously stringified by json.stringify utility, will restore all unlinked circular dependencies.
 *
 * @param  {JsonString} jsonString
 * @param  {String} referenceLocation optional property to check for references. Defaults to constants.REFERENCE_LOCATION
 * @return {Mixed} parsed json data
 */
function jsonParseCircular(jsonString, referenceLocation) {
	referenceLocation = referenceLocation || constants.REFERENCE_LOCATION;
	var json = JSON.parse(jsonString);

	o.forEach(json[referenceLocation], function (value, target) {
		value = pointer.get(json, value);
		pointer.set(json, target, value);
	});

	delete json[referenceLocation];
	return json;
}

module.exports = jsonParseCircular;

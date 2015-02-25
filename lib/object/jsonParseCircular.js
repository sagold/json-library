"use strict";

var o = require("./index"),
	constants = require("./constants"),
	pointer = require("../pointer");


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

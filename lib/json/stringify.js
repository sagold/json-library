"use strict";

var o = require("../object"),
	constants = require("../object/constants");


/**
 * Stringifies (crcular) json data, unlinking and storing circular references on the task. Json data may be reloaded
 * and linked by json.stringify.
 *
 * @param  {Mixed} data              	data to json stringify
 * @param  {Function} replacer			optional json replacer function
 * @param  {Number} space            	optional pretty print
 * @param  {String} referenceLocation	optional reference location. Defaults to constants.REFERENCE_LOCATION
 * @return {String} json string
 */
function jsonStringifyCircular(data, replacer, space, referenceLocation) {
	var result = data,
		references = {};

	referenceLocation = referenceLocation || constants.REFERENCE_LOCATION;

	removeCircularDependencies(result, "#", references);
	data[referenceLocation] = references;

	return JSON.stringify(result, function (key, value) {
		if (key === constants.PROPERTY_FLAG) {
			return;
		}
		return cb ? cb.apply(null, arguments) : value;
	}, pretty);
}

function removeCircularDependencies(object, pointer, references) {
	o.forEach(object, function (value, key) {
		var currentPointer = pointer + "/" + key;
		unlink(object, key, currentPointer, references);
	});
}

function unlink(object, key, pointer, references) {
	if (object[key][constants.PROPERTY_FLAG] != null) {
		references[pointer] = object[key][constants.PROPERTY_FLAG];
		object[key] = object[key][constants.PROPERTY_FLAG];

	} else {
		object[key][constants.PROPERTY_FLAG] = pointer;
		removeCircularDependencies(object[key], pointer, references);
	}
}

module.exports = jsonStringifyCircular;

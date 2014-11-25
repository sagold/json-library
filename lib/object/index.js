/**
 * Object based helper methods
 */

function asArray(object) {
	if (Array.isArray(object)) {
		return object; // prevent duplication
	}
	return Object.keys(object).map(function (key) {
		return object[key];
	});
}

function forEach(object, callback) {
	Object.keys(object).forEach(function (key) {
		callback(key, object[key], object);
	});
}

function keyOf(object, needle) {
	var resultKey = null;
	forEach(object, function (key) {
		if (needle === object[key]) {
			resultKey = key;
		}
	});

	return resultKey;
}

exports.asArray = asArray;
exports.forEach = forEach;
exports.keyOf = keyOf;
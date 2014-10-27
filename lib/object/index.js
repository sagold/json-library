/**
 * Object based helper methods
 */

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

exports.forEach = forEach;
exports.keyOf = keyOf;
/**
 * Object based helper methods
 */

function forEach(object, callback) {
	Object.keys(object).forEach(callback);
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
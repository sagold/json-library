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

function copy(data) {
	return JSON.parse(JSON.stringify(data));
}

exports.asArray = asArray;
exports.copy = copy;
exports.forEach = forEach;
exports.keyOf = keyOf;

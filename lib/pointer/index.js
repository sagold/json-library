/**
 * json pointer implementation
 */

function stripPointerPrefix(pointer) {
	return pointer.replace(/[#/]*/, "");
}

function get(data, pointer) {
	if (pointer == null || data == null) {
		return null;
	}

	var path = stripPointerPrefix(pointer).split("/");
	return _get(data, path);
}

function _get(data, path) {
	var property = path.shift();
	if (property) {
		if (data[property]) {
			return _get(data[property], path);
		} else {
			return null;
		}
	} else {
		return data;
	}
}

function set(data, pointer, value) {
	if (pointer == null || data == null) {
		return null;
	}

	var key, current = data || {};
	var properties = stripPointerPrefix(pointer).split("/");
	while (properties.length > 1) {
		key = properties.shift();
		current = create(current, key);
	}

	key = properties.pop();
	current[key] = value;
	return data;
}

function create(data, key) {
	if (data[key] == null) {
		data[key] = {};
	}
	return data[key]
}

module.exports.get = get;
module.exports.set = set;

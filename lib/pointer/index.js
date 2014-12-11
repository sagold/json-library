/**
 * json pointer implementation
 */

function stripPointerPrefix(pointer) {
	return pointer.replace(/[#/]*/, "");
}

function get(pointer, data) {
	if (pointer == null || data == null) {
		return null;
	}

	var path = stripPointerPrefix(pointer).split("/");
	return _get(path, data);
}

function _get(path, data) {
	var property = path.shift();
	if (property) {
		if (data[property]) {
			return _get(path, data[property]);
		} else {
			return null;
		}
	} else {
		return data;
	}
}

function set(pointer, data, value) {
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
